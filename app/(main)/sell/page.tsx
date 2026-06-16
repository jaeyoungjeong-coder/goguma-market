'use client'

import { useActionState, useState } from 'react'
import { createListing } from '@/app/actions/listings'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const MAX_IMAGES = 5

const CATEGORIES = [
  '디지털/가전',
  '가구/인테리어',
  '의류/잡화',
  '도서/티켓',
  '스포츠/레저',
  '뷰티/미용',
  '생활/주방',
  '기타',
]

const inputStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '16px',
  border: '1.5px solid #FFD0B5',
  background: '#FFFAF7',
  fontSize: '0.95rem',
  outline: 'none',
  color: '#333',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

const focusOn  = (e: React.FocusEvent<HTMLElement>) => {
  (e.target as HTMLElement).style.borderColor = '#FF6B35'
  ;(e.target as HTMLElement).style.boxShadow  = '0 0 0 3px rgba(255,107,53,0.12)'
}
const focusOff = (e: React.FocusEvent<HTMLElement>) => {
  (e.target as HTMLElement).style.borderColor = '#FFD0B5'
  ;(e.target as HTMLElement).style.boxShadow  = 'none'
}

export default function SellPage() {
  const [state, action, isPending] = useActionState(createListing, { error: null })
  const router = useRouter()
  const [previews, setPreviews] = useState<string[]>([])

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, MAX_IMAGES)
    previews.forEach((url) => URL.revokeObjectURL(url))
    setPreviews(files.map((file) => URL.createObjectURL(file)))
  }

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full"
          style={{ background: 'white', border: '1.5px solid #FFD0B5', color: '#FF6B35' }}
        >
          ←
        </button>
        <h1 className="text-lg font-bold" style={{ color: '#2D1A0E' }}>판매글 작성</h1>
      </div>

      <form action={action} className="flex flex-col gap-5">
        {/* 사진 */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#A0622E' }}>
            사진 <span className="font-normal text-xs" style={{ color: '#CCC' }}>(최대 {MAX_IMAGES}장)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            <label
              className="flex-shrink-0 w-20 h-20 rounded-2xl flex flex-col items-center justify-center cursor-pointer"
              style={{ border: '1.5px dashed #FFD0B5', background: '#FFFAF7', color: '#A0622E' }}
            >
              <span className="text-xl">📷</span>
              <span className="text-xs mt-0.5">{previews.length}/{MAX_IMAGES}</span>
              <input
                name="images"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            {previews.map((url, i) => (
              <div key={url} className="relative w-20 h-20 rounded-2xl overflow-hidden" style={{ border: '1.5px solid #FFD0B5' }}>
                <Image src={url} alt={`미리보기 ${i + 1}`} fill className="object-cover" unoptimized />
              </div>
            ))}
          </div>
        </div>

        {/* 제목 */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#A0622E' }}>
            제목 <span style={{ color: '#FF6B35' }}>*</span>
          </label>
          <input
            name="title"
            type="text"
            placeholder="판매할 상품 이름을 입력하세요"
            required
            maxLength={40}
            style={inputStyle}
            onFocus={focusOn}
            onBlur={focusOff}
          />
        </div>

        {/* 카테고리 */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#A0622E' }}>
            카테고리 <span style={{ color: '#FF6B35' }}>*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <label key={cat} className="cursor-pointer">
                <input type="radio" name="category" value={cat} required className="sr-only" />
                <span
                  className="inline-block px-3 py-1.5 rounded-full text-sm font-medium border transition-all"
                  style={{ borderColor: '#FFD0B5', background: 'white', color: '#A0622E' }}
                  onMouseEnter={e => {
                    const el = e.currentTarget
                    el.style.background = '#FF6B35'
                    el.style.color = 'white'
                    el.style.borderColor = '#FF6B35'
                  }}
                  onMouseLeave={e => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement
                    if (!input?.checked) {
                      const el = e.currentTarget
                      el.style.background = 'white'
                      el.style.color = '#A0622E'
                      el.style.borderColor = '#FFD0B5'
                    }
                  }}
                >
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 가격 */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#A0622E' }}>
            가격 <span style={{ color: '#FF6B35' }}>*</span>
          </label>
          <div className="relative">
            <input
              name="price"
              type="number"
              placeholder="0"
              min={0}
              required
              style={{ ...inputStyle, paddingRight: '3rem' }}
              onFocus={focusOn}
              onBlur={focusOff}
            />
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold"
              style={{ color: '#A0622E' }}
            >
              원
            </span>
          </div>
        </div>

        {/* 설명 */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#A0622E' }}>
            설명 <span className="font-normal text-xs" style={{ color: '#CCC' }}>(선택)</span>
          </label>
          <textarea
            name="description"
            placeholder={"상품 상태, 구매 시기 등 자세한 내용을 적어주세요.\n\n예) 작년에 구매했고, 1~2번 사용했어요. 박스 있어요."}
            rows={5}
            style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
            onFocus={focusOn}
            onBlur={focusOff}
          />
        </div>

        {/* 에러 메시지 */}
        {state?.error && (
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm"
            style={{ background: '#FFF0F0', color: '#E53E3E', border: '1px solid #FFC8C8' }}
          >
            <span>😢</span> {state.error}
          </div>
        )}

        {/* 등록 버튼 */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3.5 rounded-full font-bold text-white transition-transform active:scale-95"
          style={{
            background: isPending
              ? 'linear-gradient(135deg, #FFA07A, #FF85A1)'
              : 'linear-gradient(135deg, #FF6B35, #FF3D9A)',
            boxShadow: isPending ? 'none' : '0 6px 20px rgba(255,107,53,0.35)',
            cursor: isPending ? 'not-allowed' : 'pointer',
          }}
        >
          {isPending ? '등록 중... ⏳' : '판매글 등록하기 🍠'}
        </button>
      </form>
    </div>
  )
}
