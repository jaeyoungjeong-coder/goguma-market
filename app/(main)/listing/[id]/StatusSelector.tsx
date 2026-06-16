'use client'

import { useState, useTransition } from 'react'
import { updateListingStatus, type ListingStatus } from '@/app/actions/listings'

const OPTIONS: { value: ListingStatus; label: string }[] = [
  { value: 'selling',  label: '판매중 🟠' },
  { value: 'reserved', label: '거래중 🟡' },
  { value: 'sold',     label: '판매완료 ⚫' },
]

export default function StatusSelector({
  id,
  initialStatus,
}: {
  id: number
  initialStatus: ListingStatus
}) {
  const [status, setStatus] = useState(initialStatus)
  const [isPending, startTransition] = useTransition()

  function handleChange(next: ListingStatus) {
    if (next === status) return
    setStatus(next)
    startTransition(async () => {
      await updateListingStatus(id, next)
    })
  }

  return (
    <div className="flex gap-1.5 mb-3">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          disabled={isPending}
          onClick={() => handleChange(opt.value)}
          className="text-xs px-3 py-1.5 rounded-full font-semibold transition-opacity"
          style={
            status === opt.value
              ? { background: '#FF6B35', color: 'white' }
              : { background: '#F5F5F5', color: '#888' }
          }
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
