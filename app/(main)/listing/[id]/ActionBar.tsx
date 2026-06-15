'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteListing } from '@/app/actions/listings'

export function OwnerActionBar({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    if (!confirm('정말 삭제할까요?')) return
    startTransition(async () => {
      await deleteListing(id)
    })
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 px-4 py-4 flex gap-3"
      style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', borderTop: '1px solid #FFE4D6' }}
    >
      <button
        onClick={() => router.push(`/listing/${id}/edit`)}
        className="flex-1 py-3.5 rounded-full font-bold text-sm"
        style={{ background: '#FFF0E8', color: '#FF6B35', border: '1.5px solid #FFD0B5' }}
      >
        수정하기 ✏️
      </button>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="flex-1 py-3.5 rounded-full font-bold text-sm text-white transition-opacity disabled:opacity-60"
        style={{ background: 'linear-gradient(135deg, #FF6B35, #FF3D9A)', boxShadow: '0 4px 14px rgba(255,107,53,0.3)' }}
      >
        {isPending ? '삭제 중...' : '삭제하기 🗑️'}
      </button>
    </div>
  )
}

export function BuyerActionBar() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 px-4 py-4"
      style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', borderTop: '1px solid #FFE4D6' }}
    >
      <button
        className="w-full py-3.5 rounded-full font-bold text-white"
        style={{ background: 'linear-gradient(135deg, #FF6B35, #FF3D9A)', boxShadow: '0 4px 14px rgba(255,107,53,0.3)' }}
        onClick={() => alert('채팅 기능은 준비 중이에요 🍠')}
      >
        채팅하기 💬
      </button>
    </div>
  )
}
