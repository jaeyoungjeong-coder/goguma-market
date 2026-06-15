import Link from 'next/link'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #FFF5F0 0%, #FFF9F5 100%)' }}>
      {/* 헤더 */}
      <header
        className="sticky top-0 z-10"
        style={{
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,210,190,0.5)',
          boxShadow: '0 2px 16px rgba(255,107,53,0.08)',
        }}
      >
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/home" className="flex items-center gap-2">
              <span className="text-2xl">🍠</span>
              <span
                className="text-lg font-extrabold"
                style={{
                  background: 'linear-gradient(135deg, #FF6B35, #FF3D9A)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                고구마마켓
              </span>
            </Link>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: '#FFF0F5', color: '#FF3D9A' }}>
              BETA
            </span>
          </div>

          {/* 판매하기 버튼 */}
          <Link
            href="/sell"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-white transition-transform active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #FF6B35, #FF3D9A)',
              boxShadow: '0 4px 12px rgba(255,107,53,0.3)',
            }}
          >
            <span>+</span> 판매하기
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
