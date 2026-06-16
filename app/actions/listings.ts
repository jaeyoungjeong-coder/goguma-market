'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { SupabaseClient } from '@supabase/supabase-js'

export type ListingState = {
  error: string | null
}

const MAX_IMAGES = 5
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

function getStoragePath(publicUrl: string) {
  const marker = '/listing-images/'
  const idx = publicUrl.indexOf(marker)
  return idx === -1 ? null : publicUrl.slice(idx + marker.length)
}

async function uploadImages(supabase: SupabaseClient, userId: string, files: File[]) {
  const urls: string[] = []
  for (const file of files) {
    if (!file.size) continue
    if (!file.type.startsWith('image/')) throw new Error('이미지 파일만 업로드할 수 있어요.')
    if (file.size > MAX_IMAGE_SIZE) throw new Error('이미지는 5MB 이하로 올려주세요.')

    const ext = file.name.includes('.') ? file.name.split('.').pop() : 'jpg'
    const path = `${userId}/${crypto.randomUUID()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('listing-images')
      .upload(path, file, { contentType: file.type })

    if (uploadError) throw new Error('이미지 업로드에 실패했어요.')

    const { data } = supabase.storage.from('listing-images').getPublicUrl(path)
    urls.push(data.publicUrl)
  }
  return urls
}

async function deleteImagesFromStorage(supabase: SupabaseClient, urls: string[]) {
  const paths = urls.map(getStoragePath).filter((p): p is string => !!p)
  if (paths.length) await supabase.storage.from('listing-images').remove(paths)
}

export async function createListing(
  state: ListingState,
  formData: FormData
): Promise<ListingState> {
  const title       = (formData.get('title') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()
  const price       = formData.get('price') as string
  const category    = formData.get('category') as string
  const imageFiles   = formData.getAll('images').filter((f): f is File => f instanceof File && f.size > 0)

  if (!title)    return { error: '제목을 입력해주세요.' }
  if (!price)    return { error: '가격을 입력해주세요.' }
  if (!category) return { error: '카테고리를 선택해주세요.' }
  if (imageFiles.length > MAX_IMAGES) return { error: `사진은 최대 ${MAX_IMAGES}장까지 올릴 수 있어요.` }

  const priceNum = Number(price)
  if (isNaN(priceNum) || priceNum < 0) return { error: '올바른 가격을 입력해주세요.' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '로그인이 필요해요.' }

  let images: string[] = []
  try {
    images = await uploadImages(supabase, user.id, imageFiles)
  } catch (e) {
    return { error: e instanceof Error ? e.message : '이미지 업로드에 실패했어요.' }
  }

  const { error } = await supabase.from('listings').insert({
    user_id:     user.id,
    title,
    description: description || null,
    price:       priceNum,
    category,
    images,
  })

  if (error) return { error: '저장에 실패했어요. 다시 시도해주세요.' }

  redirect('/home')
}

async function verifyOwner(listingId: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { user: null, listing: null, error: '로그인이 필요해요.' as string }

  const { data: listing } = await supabase
    .from('listings')
    .select('id, user_id, images')
    .eq('id', listingId)
    .single()

  if (!listing) return { user, listing: null, error: '존재하지 않는 글이에요.' as string }
  if (listing.user_id !== user.id) return { user, listing: null, error: '본인의 글만 수정/삭제할 수 있어요.' as string }

  return { user, listing, supabase, error: null }
}

export async function updateListing(
  id: number,
  state: ListingState,
  formData: FormData
): Promise<ListingState> {
  const title       = (formData.get('title') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()
  const price       = formData.get('price') as string
  const category    = formData.get('category') as string
  const keepImages  = formData.getAll('keepImages').filter((v): v is string => typeof v === 'string')
  const newFiles    = formData.getAll('images').filter((f): f is File => f instanceof File && f.size > 0)

  if (!title)    return { error: '제목을 입력해주세요.' }
  if (!price)    return { error: '가격을 입력해주세요.' }
  if (!category) return { error: '카테고리를 선택해주세요.' }
  if (keepImages.length + newFiles.length > MAX_IMAGES) {
    return { error: `사진은 최대 ${MAX_IMAGES}장까지 올릴 수 있어요.` }
  }

  const priceNum = Number(price)
  if (isNaN(priceNum) || priceNum < 0) return { error: '올바른 가격을 입력해주세요.' }

  const { listing, error: ownerError } = await verifyOwner(id)
  if (ownerError) return { error: ownerError }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const removedImages = (listing!.images as string[]).filter((url) => !keepImages.includes(url))

  let newImages: string[] = []
  try {
    newImages = await uploadImages(supabase, user!.id, newFiles)
  } catch (e) {
    return { error: e instanceof Error ? e.message : '이미지 업로드에 실패했어요.' }
  }

  const images = [...keepImages, ...newImages]

  const { error } = await supabase
    .from('listings')
    .update({ title, description: description || null, price: priceNum, category, images })
    .eq('id', id)
    .eq('user_id', user!.id)

  if (error) return { error: '수정에 실패했어요. 다시 시도해주세요.' }

  if (removedImages.length) await deleteImagesFromStorage(supabase, removedImages)

  redirect(`/listing/${id}`)
}

export async function deleteListing(id: number) {
  const { listing, error: ownerError } = await verifyOwner(id)
  if (ownerError) redirect('/home')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  await supabase
    .from('listings')
    .delete()
    .eq('id', id)
    .eq('user_id', user!.id)

  if (listing!.images?.length) await deleteImagesFromStorage(supabase, listing!.images as string[])

  redirect('/home')
}
