'use client'

import { useActionState } from 'react'
import { signIn } from '@/app/actions/auth'
import Link from 'next/link'

const inputStyle = {
  width: '100%',
  padding: '0.75rem 1.1rem',
  borderRadius: '50px',
  border: '1.5px solid #FFD0B5',
  background: '#FFFAF7',
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  color: '#333',
}

export default function LoginPage() {
  const [state, action, isPending] = useActionState(signIn, { error: null })

  return (
    <>
      <h2 className="text-xl font-bold text-center mb-5" style={{ color: '#2D1A0E' }}>
        로그인 🔑
      </h2>

      <form action={action} className="flex flex-col gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1.5 ml-1" style={{ color: '#A0622E' }}>
            이메일
          </label>
          <input
            name="email"
            type="email"
            placeholder="example@email.com"
            required
            style={inputStyle}
            onFocus={e => {
              e.target.style.borderColor = '#FF6B35'
              e.target.style.boxShadow = '0 0 0 3px rgba(255,107,53,0.12)'
            }}
            onBlur={e => {
              e.target.style.borderColor = '#FFD0B5'
              e.target.style.boxShadow = 'none'
            }}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5 ml-1" style={{ color: '#A0622E' }}>
            비밀번호
          </label>
          <input
            name="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            required
            style={inputStyle}
            onFocus={e => {
              e.target.style.borderColor = '#FF6B35'
              e.target.style.boxShadow = '0 0 0 3px rgba(255,107,53,0.12)'
            }}
            onBlur={e => {
              e.target.style.borderColor = '#FFD0B5'
              e.target.style.boxShadow = 'none'
            }}
          />
        </div>

        {state?.error && (
          <div
            className="text-sm px-4 py-2.5 rounded-2xl flex items-center gap-2"
            style={{ background: '#FFF0F0', color: '#E53E3E', border: '1px solid #FFC8C8' }}
          >
            <span>😢</span> {state.error}
          </div>
        )}

        {/* 회원가입 링크 먼저 */}
        <div className="text-center mt-1">
          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #FFD0B5, transparent)', marginBottom: '0.75rem' }} />
          <p className="text-sm" style={{ color: '#B08060' }}>
            아직 계정이 없으신가요?{' '}
            <Link href="/signup" className="font-bold" style={{ color: '#FF6B35' }}>
              회원가입 →
            </Link>
          </p>
          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #FFD0B5, transparent)', marginTop: '0.75rem' }} />
        </div>

        {/* 로그인 버튼 아래 */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 rounded-full font-bold text-white text-sm transition-transform active:scale-95"
          style={{
            background: isPending
              ? 'linear-gradient(135deg, #FFA07A, #FF85A1)'
              : 'linear-gradient(135deg, #FF6B35, #FF3D9A)',
            boxShadow: isPending ? 'none' : '0 6px 20px rgba(255,107,53,0.35)',
            cursor: isPending ? 'not-allowed' : 'pointer',
          }}
        >
          {isPending ? '로그인 중... ⏳' : '로그인 🚀'}
        </button>
      </form>
    </>
  )
}
