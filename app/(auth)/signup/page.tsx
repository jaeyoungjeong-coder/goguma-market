'use client'

import { useActionState } from 'react'
import { signUp } from '@/app/actions/auth'
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

export default function SignupPage() {
  const [state, action, isPending] = useActionState(signUp, { error: null })

  if (state?.message) {
    return (
      <div className="text-center py-4">
        <div className="text-5xl mb-4">📬</div>
        <h2 className="text-lg font-bold mb-2" style={{ color: '#2D1A0E' }}>이메일을 확인해주세요!</h2>
        <p className="text-sm leading-relaxed" style={{ color: '#8C6040' }}>
          인증 링크를 보내드렸어요. <br />메일함을 확인해주세요 🌸
        </p>
        <Link
          href="/login"
          className="inline-block mt-6 px-6 py-2.5 rounded-full text-sm font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #FF6B35, #FF3D9A)', boxShadow: '0 4px 14px rgba(255,107,53,0.3)' }}
        >
          로그인으로 →
        </Link>
      </div>
    )
  }

  return (
    <>
      <h2 className="text-xl font-bold text-center mb-5" style={{ color: '#2D1A0E' }}>
        회원가입 🎉
      </h2>

      <form action={action} className="flex flex-col gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1.5 ml-1" style={{ color: '#A0622E' }}>
            닉네임
          </label>
          <input
            name="nickname"
            type="text"
            placeholder="사용할 닉네임을 입력하세요"
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
            placeholder="6자 이상 입력하세요"
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

        {/* 로그인 링크 먼저 */}
        <div className="text-center mt-1">
          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #FFD0B5, transparent)', marginBottom: '0.75rem' }} />
          <p className="text-sm" style={{ color: '#B08060' }}>
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="font-bold" style={{ color: '#FF6B35' }}>
              로그인 →
            </Link>
          </p>
          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #FFD0B5, transparent)', marginTop: '0.75rem' }} />
        </div>

        {/* 가입하기 버튼 아래 */}
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
          {isPending ? '가입 중... ⏳' : '가입하기 🍠'}
        </button>
      </form>
    </>
  )
}
