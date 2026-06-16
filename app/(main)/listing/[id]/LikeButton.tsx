'use client'

import { useState, useTransition } from 'react'
import { toggleLike } from '@/app/actions/likes'

export default function LikeButton({
  listingId,
  initialLiked,
  initialCount,
}: {
  listingId: number
  initialLiked: boolean
  initialCount: number
}) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    const nextLiked = !liked
    setLiked(nextLiked)
    setCount((c) => c + (nextLiked ? 1 : -1))
    startTransition(async () => {
      await toggleLike(listingId)
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-bold transition-transform active:scale-90"
      style={{
        background: liked ? '#FFE4ED' : '#F5F5F5',
        color: liked ? '#FF3D9A' : '#999',
      }}
    >
      <span style={{ fontSize: '1.05rem' }}>{liked ? '❤️' : '🤍'}</span>
      {count}
    </button>
  )
}
