'use client'

import { useActionState } from 'react'
import { updateListing } from '@/app/actions/listings'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
  '디지털/가전', '가구/인테리어', '의류/잡화', '도서/티켓',
  '스포츠/레저', '뷰티/미용', '생활/주방', '기타',
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

type Props = {
  id: number
  initial: {
    title: string
    category: string
    price: number
    description: string | null
  }
}

export default function EditForm({ id, initial }: Props) {
  const boundAction = updateListing.bind(null, id)
  const [state, action, isPending] = useActionState(boundAction, { error: null })
  const router = useRouter()

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
        <h1 className="text-lg font-bold" style={{ color: '#2D1A0E' }}>판매글 수정</h1>
      </div>

      <form action={action} className="flex flex-col gap-5">
        {/* 제목 */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#A0622E' }}>
            제목 <span style={{ color: '#FF6B35' }}>*</span>
          </label>
          <input
            name="title"
            type="text"
            defaultValue={initial.title}
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
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  defaultChecked={initial.category === cat}
                  required
                  className="sr-only"
                />
                <span
                  className="inline-block px-3 py-1.5 rounded-full text-sm font-medium border transition-all"
                  style={
                    initial.category === cat
                      ? { background: '#FF6B35', color: 'white', borderColor: '#FF6B35' }
                      : { borderColor: '#FFD0B5', background: 'white', color: '#A0622E' }
                  }
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
              defaultValue={initial.price}
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
            defaultValue={initial.description ?? ''}
            rows={5}
            style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
            onFocus={focusOn}
            onBlur={focusOff}
          />
        </div>

        {/* 에러 */}
        {state?.error && (
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm"
            style={{ background: '#FFF0F0', color: '#E53E3E', border: '1px solid #FFC8C8' }}
          >
            <span>😢</span> {state.error}
          </div>
        )}

        {/* 저장 버튼 */}
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
          {isPending ? '저장 중... ⏳' : '수정 완료 ✅'}
        </button>
      </form>
    </div>
  )
}
