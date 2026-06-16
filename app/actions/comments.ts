'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type CommentState = {
  error: string | null
}

export async function createComment(
  listingId: number,
  state: CommentState,
  formData: FormData
): Promise<CommentState> {
  const content = (formData.get('content') as string)?.trim()
  if (!content) return { error: '댓글을 입력해주세요.' }
  if (content.length > 500) return { error: '댓글은 500자 이하로 입력해주세요.' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '로그인이 필요해요.' }

  const { error } = await supabase.from('comments').insert({
    listing_id: listingId,
    user_id: user.id,
    content,
  })

  if (error) return { error: '댓글 등록에 실패했어요. 다시 시도해주세요.' }

  revalidatePath(`/listing/${listingId}`)
  return { error: null }
}

export async function updateComment(
  commentId: number,
  listingId: number,
  state: CommentState,
  formData: FormData
): Promise<CommentState> {
  const content = (formData.get('content') as string)?.trim()
  if (!content) return { error: '댓글을 입력해주세요.' }
  if (content.length > 500) return { error: '댓글은 500자 이하로 입력해주세요.' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '로그인이 필요해요.' }

  const { error } = await supabase
    .from('comments')
    .update({ content })
    .eq('id', commentId)
    .eq('user_id', user.id)

  if (error) return { error: '댓글 수정에 실패했어요. 다시 시도해주세요.' }

  revalidatePath(`/listing/${listingId}`)
  return { error: null }
}

export async function deleteComment(commentId: number, listingId: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', user.id)

  revalidatePath(`/listing/${listingId}`)
}
