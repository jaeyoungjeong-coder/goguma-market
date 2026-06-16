'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0)

  return (
    <div className="mb-5">
      <div
        className="relative w-full aspect-square rounded-3xl overflow-hidden"
        style={{ background: '#FFF0E8' }}
      >
        <Image src={images[active]} alt={alt} fill className="object-cover" priority />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto">
          {images.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(i)}
              className="relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden"
              style={{ border: i === active ? '2px solid #FF6B35' : '1.5px solid #FFD0B5' }}
            >
              <Image src={url} alt={`${alt} ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
