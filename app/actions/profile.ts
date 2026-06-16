'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type ProfileState = {
  error: string | null
}

const MAX_AVATAR_SIZE = 5 * 1024 * 1024 // 5MB

function getAvatarStoragePath(publicUrl: string) {
  const marker = '/avatars/'
  const idx = publicUrl.indexOf(marker)
  return idx === -1 ? null : publicUrl.slice(idx + marker.length)
}

export async function updateProfile(
  state: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const bio = (formData.get('bio') as string)?.trim()
  const removeAvatar = formData.get('removeAvatar') === 'true'
  const avatarFile = formData.get('avatar')

  if (bio && bio.length > 200) return { error: '자기소개는 200자 이하로 입력해주세요.' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '로그인이 필요해요.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('avatar_url')
    .eq('id', user.id)
    .single()

  const oldAvatarUrl = profile?.avatar_url ?? null
  let avatarUrl = oldAvatarUrl

  if (avatarFile instanceof File && avatarFile.size > 0) {
    if (!avatarFile.type.startsWith('image/')) return { error: '이미지 파일만 업로드할 수 있어요.' }
    if (avatarFile.size > MAX_AVATAR_SIZE) return { error: '이미지는 5MB 이하로 올려주세요.' }

    const ext = avatarFile.name.includes('.') ? avatarFile.name.split('.').pop() : 'jpg'
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, avatarFile, { contentType: avatarFile.type })

    if (uploadError) return { error: '프로필 사진 업로드에 실패했어요.' }

    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    avatarUrl = data.publicUrl
  } else if (removeAvatar) {
    avatarUrl = null
  }

  const { error } = await supabase
    .from('profiles')
    .update({ bio: bio || null, avatar_url: avatarUrl })
    .eq('id', user.id)

  if (error) return { error: '프로필 저장에 실패했어요. 다시 시도해주세요.' }

  if (oldAvatarUrl && oldAvatarUrl !== avatarUrl) {
    const oldPath = getAvatarStoragePath(oldAvatarUrl)
    if (oldPath) await supabase.storage.from('avatars').remove([oldPath])
  }

  revalidatePath('/home')
  revalidatePath('/profile/edit')
  return { error: null }
}
