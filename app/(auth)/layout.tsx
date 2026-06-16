export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* 플로팅 데코레이션 */}
      <span className="float-1 select-none" style={{ position: 'absolute', top: '7%',  left: '8%',  fontSize: '2.2rem', opacity: 0.55 }}>🍠</span>
      <span className="float-2 select-none" style={{ position: 'absolute', top: '13%', right: '9%',  fontSize: '1.6rem', opacity: 0.5  }}>✨</span>
      <span className="float-3 select-none" style={{ position: 'absolute', top: '28%', left: '4%',  fontSize: '1.3rem', opacity: 0.45 }}>💕</span>
      <span className="float-1 select-none" style={{ position: 'absolute', top: '45%', right: '6%',  fontSize: '1.5rem', opacity: 0.45 }}>🌟</span>
      <span className="float-2 select-none" style={{ position: 'absolute', bottom: '28%', left: '7%', fontSize: '1.4rem', opacity: 0.45 }}>🌸</span>
      <span className="float-3 select-none" style={{ position: 'absolute', bottom: '18%', right: '8%',fontSize: '1.8rem', opacity: 0.5  }}>🍬</span>
      <span className="float-1 select-none" style={{ position: 'absolute', bottom: '9%',  left: '14%', fontSize: '1.2rem', opacity: 0.4  }}>💛</span>
      <span className="float-2 select-none" style={{ position: 'absolute', top: '65%',  right: '14%', fontSize: '1rem',  opacity: 0.4  }}>🎀</span>

      {/* 로고 */}
      <div className="mb-7 text-center relative z-10">
        <div className="wiggle inline-block text-6xl mb-1">🍠</div>
        <h1
          className="text-[2rem] font-extrabold tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #FF6B35 30%, #FF3D9A)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          고구마마켓
        </h1>
        <p className="text-sm mt-1" style={{ color: '#C07858' }}>
          🧡 우리 동네 따뜻한 중고거래
        </p>
      </div>

      {/* 카드 */}
      <div
        className="pop-in w-full relative z-10"
        style={{
          maxWidth: '380px',
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          borderRadius: '28px',
          padding: '2rem',
          boxShadow: '0 24px 64px rgba(255,107,53,0.18), 0 6px 24px rgba(255,61,154,0.1)',
          border: '1.5px solid rgba(255,210,190,0.6)',
        }}
      >
        {children}
      </div>

      <p className="mt-6 text-xs relative z-10" style={{ color: '#D4956A', opacity: 0.75 }}>
        🌸 고구마마켓과 함께해요 🌸
      </p>
    </div>
  )
}
