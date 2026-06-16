'use client'

import { useActionState, useEffect, useState, useTransition } from 'react'
import { createComment, deleteComment, updateComment } from '@/app/actions/comments'

type Comment = {
  id: number
  content: string
  created_at: string
  user_id: string
  profiles: { nickname: string } | { nickname: string }[] | null
}

function nicknameOf(comment: Comment) {
  const p = comment.profiles
  if (!p) return '고구마 유저'
  return Array.isArray(p) ? p[0]?.nickname ?? '고구마 유저' : p.nickname
}

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60)    return '방금 전'
  if (diff < 3600)  return `${Math.floor(diff / 60)}분 전`
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
  return `${Math.floor(diff / 86400)}일 전`
}

const inputStyle = {
  flex: 1,
  padding: '0.65rem 1rem',
  borderRadius: '50px',
  border: '1.5px solid #FFD0B5',
  background: '#FFFAF7',
  fontSize: '0.9rem',
  outline: 'none',
  color: '#333',
}

export default function CommentsSection({
  listingId,
  currentUserId,
  comments,
}: {
  listingId: number
  currentUserId: string | null
  comments: Comment[]
}) {
  const boundCreate = createComment.bind(null, listingId)
  const [state, action, isPending] = useActionState(boundCreate, { error: null })

  return (
    <div>
      <h2 className="text-sm font-bold mb-3" style={{ color: '#A0622E' }}>
        댓글 {comments.length}
      </h2>

      <div className="flex flex-col gap-3 mb-4">
        {comments.length === 0 && (
          <p className="text-sm" style={{ color: '#CCC' }}>아직 댓글이 없어요. 첫 댓글을 남겨보세요!</p>
        )}
        {comments.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            listingId={listingId}
            isOwner={c.user_id === currentUserId}
          />
        ))}
      </div>

      {currentUserId && (
        <form action={action} className="flex items-center gap-2">
          <input name="content" placeholder="댓글을 입력하세요" required maxLength={500} style={inputStyle} />
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2.5 rounded-full text-sm font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #FF6B35, #FF3D9A)' }}
          >
            등록
          </button>
        </form>
      )}
      {state?.error && (
        <p className="text-xs mt-2" style={{ color: '#E53E3E' }}>😢 {state.error}</p>
      )}
    </div>
  )
}

function CommentItem({
  comment,
  listingId,
  isOwner,
}: {
  comment: Comment
  listingId: number
  isOwner: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [isDeleting, startDeleteTransition] = useTransition()
  const boundUpdate = updateComment.bind(null, comment.id, listingId)
  const [state, action, isPending] = useActionState(boundUpdate, { error: null })

  useEffect(() => {
    if (editing) setEditing(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comment.content])

  function handleDelete() {
    if (!confirm('댓글을 삭제할까요?')) return
    startDeleteTransition(async () => {
      await deleteComment(comment.id, listingId)
    })
  }

  if (editing) {
    return (
      <div>
        <form action={action} className="flex items-center gap-2">
          <input name="content" defaultValue={comment.content} required maxLength={500} style={inputStyle} />
          <button
            type="submit"
            disabled={isPending}
            className="px-3 py-2 rounded-full text-xs font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #FF6B35, #FF3D9A)' }}
          >
            완료
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="px-3 py-2 rounded-full text-xs font-bold flex-shrink-0"
            style={{ background: '#F5F5F5', color: '#888' }}
          >
            취소
          </button>
        </form>
        {state?.error && (
          <p className="text-xs mt-1" style={{ color: '#E53E3E' }}>😢 {state.error}</p>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <div className="flex items-baseline gap-1.5">
          <p className="font-semibold text-sm" style={{ color: '#1A1A1A' }}>
            {nicknameOf(comment)}
          </p>
          <p className="text-xs" style={{ color: '#C0A080' }}>{timeAgo(comment.created_at)}</p>
        </div>
        <p className="text-sm mt-0.5 whitespace-pre-wrap" style={{ color: '#4A4A4A' }}>
          {comment.content}
        </p>
      </div>
      {isOwner && (
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={() => setEditing(true)} className="text-xs font-semibold" style={{ color: '#A0622E' }}>
            수정
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-xs font-semibold"
            style={{ color: '#E53E3E' }}
          >
            삭제
          </button>
        </div>
      )}
    </div>
  )
}
