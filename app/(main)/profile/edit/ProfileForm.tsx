'use client'

import { useActionState, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { updateProfile } from '@/app/actions/profile'

const inputStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '16px',
  border: '1.5px solid #FFD0B5',
  background: '#FFFAF7',
  fontSize: '0.95rem',
  outline: 'none',
  color: '#333',
  resize: 'none' as const,
}

export default function ProfileForm({
  initial,
}: {
  initial: { nickname: string; bio: string; avatarUrl: string | null }
}) {
  const [state, action, isPending] = useActionState(updateProfile, { error: null })
  const router = useRouter()

  const [preview, setPreview] = useState<string | null>(initial.avatarUrl)
  const [removed, setRemoved] = useState(false)

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setRemoved(false)
    setPreview(URL.createObjectURL(file))
  }

  function handleRemoveAvatar() {
    setPreview(null)
    setRemoved(true)
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
        <h1 className="text-lg font-bold" style={{ color: '#2D1A0E' }}>프로필 수정</h1>
      </div>

      <form action={action} className="flex flex-col gap-5">
        <input type="hidden" name="removeAvatar" value={removed ? 'true' : 'false'} />

        {/* 프로필 사진 */}
        <div className="flex flex-col items-center gap-3">
          <label className="relative cursor-pointer">
            <div
              className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center text-4xl"
              style={{ background: 'linear-gradient(135deg, #FF6B35, #FF3D9A)' }}
            >
              {preview ? (
                <Image src={preview} alt="프로필 사진" width={96} height={96} className="w-full h-full object-cover" unoptimized={preview.startsWith('blob:')} />
              ) : (
                '🍠'
              )}
            </div>
            <span
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center text-xs"
              style={{ background: 'white', border: '1.5px solid #FFD0B5' }}
            >
              📷
            </span>
            <input name="avatar" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </label>
          {preview && (
            <button type="button" onClick={handleRemoveAvatar} className="text-xs font-semibold" style={{ color: '#E53E3E' }}>
              사진 삭제
            </button>
          )}
        </div>

        {/* 닉네임 (읽기 전용) */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#A0622E' }}>닉네임</label>
          <div style={{ ...inputStyle, background: '#F5F5F5', color: '#888' }}>{initial.nickname}</div>
        </div>

        {/* 자기소개 */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#A0622E' }}>
            자기소개 <span className="font-normal text-xs" style={{ color: '#CCC' }}>(선택, 최대 200자)</span>
          </label>
          <textarea
            name="bio"
            defaultValue={initial.bio}
            placeholder="나를 소개하는 한 줄을 남겨보세요"
            rows={4}
            maxLength={200}
            style={inputStyle}
          />
        </div>

        {state?.error && (
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm"
            style={{ background: '#FFF0F0', color: '#E53E3E', border: '1px solid #FFC8C8' }}
          >
            <span>😢</span> {state.error}
          </div>
        )}

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
          {isPending ? '저장 중... ⏳' : '저장하기 ✅'}
        </button>
      </form>
    </div>
  )
}
