'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type ListingState = {
  error: string | null
}

export async function createListing(
  state: ListingState,
  formData: FormData
): Promise<ListingState> {
  const title       = (formData.get('title') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()
  const price       = formData.get('price') as string
  const category    = formData.get('category') as string

  if (!title)    return { error: '제목을 입력해주세요.' }
  if (!price)    return { error: '가격을 입력해주세요.' }
  if (!category) return { error: '카테고리를 선택해주세요.' }

  const priceNum = Number(price)
  if (isNaN(priceNum) || priceNum < 0) return { error: '올바른 가격을 입력해주세요.' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '로그인이 필요해요.' }

  const { error } = await supabase.from('listings').insert({
    user_id:     user.id,
    title,
    description: description || null,
    price:       priceNum,
    category,
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
    .select('id, user_id')
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

  if (!title)    return { error: '제목을 입력해주세요.' }
  if (!price)    return { error: '가격을 입력해주세요.' }
  if (!category) return { error: '카테고리를 선택해주세요.' }

  const priceNum = Number(price)
  if (isNaN(priceNum) || priceNum < 0) return { error: '올바른 가격을 입력해주세요.' }

  const { error: ownerError } = await verifyOwner(id)
  if (ownerError) return { error: ownerError }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase
    .from('listings')
    .update({ title, description: description || null, price: priceNum, category })
    .eq('id', id)
    .eq('user_id', user!.id)

  if (error) return { error: '수정에 실패했어요. 다시 시도해주세요.' }

  redirect(`/listing/${id}`)
}

export async function deleteListing(id: number) {
  const { error: ownerError } = await verifyOwner(id)
  if (ownerError) redirect('/home')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  await supabase
    .from('listings')
    .delete()
    .eq('id', id)
    .eq('user_id', user!.id)

  redirect('/home')
}
