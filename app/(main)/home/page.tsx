import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { signOut } from '@/app/actions/auth'
import Link from 'next/link'
import Image from 'next/image'

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60)    return '방금 전'
  if (diff < 3600)  return `${Math.floor(diff / 60)}분 전`
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
  return `${Math.floor(diff / 86400)}일 전`
}

function formatPrice(price: number) {
  return price === 0 ? '나눔 🤝' : `${price.toLocaleString()}원`
}

const STATUS_LABEL: Record<string, string> = {
  selling:  '판매중',
  reserved: '거래중',
  sold:     '판매완료',
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const nickname = user.user_metadata?.nickname || user.email?.split('@')[0]

  const { data: listings } = await supabase
    .from('listings')
    .select('id, title, price, category, status, created_at, images, likes(count)')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="flex flex-col gap-4">
      {/* 웰컴 카드 */}
      <div
        className="rounded-3xl p-5 text-white relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #FF6B35 0%, #FF3D9A 100%)',
          boxShadow: '0 12px 32px rgba(255,107,53,0.3)',
        }}
      >
        <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '6rem', opacity: 0.15 }}>🍠</div>
        <p className="text-sm opacity-80 mb-1">안녕하세요! 👋</p>
        <p className="text-xl font-extrabold">{nickname} 님</p>
        <div
          className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: 'rgba(255,255,255,0.25)' }}
        >
          <span>🌟</span> 고구마마켓 회원
        </div>
      </div>

      {/* 판매글 헤더 */}
      <div className="flex items-center justify-between mt-1">
        <h2 className="font-bold text-base" style={{ color: '#2D1A0E' }}>
          전체 판매글 {listings && listings.length > 0 ? `(${listings.length})` : ''}
        </h2>
        <Link
          href="/sell"
          className="text-sm font-semibold px-3 py-1.5 rounded-full"
          style={{ background: '#FFF0E8', color: '#FF6B35' }}
        >
          + 글쓰기
        </Link>
      </div>

      {/* 판매글 없을 때 */}
      {(!listings || listings.length === 0) && (
        <div
          className="rounded-3xl p-8 text-center"
          style={{ background: 'white', border: '1.5px dashed #FFD0B5' }}
        >
          <div className="text-4xl mb-3">🛒</div>
          <p className="font-bold" style={{ color: '#2D1A0E' }}>아직 판매글이 없어요</p>
          <p className="text-sm mt-1" style={{ color: '#B08060' }}>첫 번째 판매글을 올려보세요!</p>
          <Link
            href="/sell"
            className="inline-block mt-4 px-6 py-2.5 rounded-full text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #FF6B35, #FF3D9A)', boxShadow: '0 4px 14px rgba(255,107,53,0.3)' }}
          >
            판매글 작성하기 →
          </Link>
        </div>
      )}

      {/* 판매글 목록 */}
      {listings && listings.length > 0 && (
        <div className="flex flex-col gap-2">
          {listings.map((item) => (
            <Link
              key={item.id}
              href={`/listing/${item.id}`}
              className="bg-white rounded-2xl p-4 flex items-center gap-4 transition-transform active:scale-[0.98]"
              style={{ border: '1px solid rgba(255,210,190,0.4)', boxShadow: '0 2px 12px rgba(255,107,53,0.06)' }}
            >
              {/* 이미지 */}
              {item.images && item.images.length > 0 ? (
                <div className="flex-shrink-0 flex gap-1">
                  {item.images.slice(0, 3).map((url: string, i: number) => (
                    <div
                      key={url}
                      className="relative w-14 h-14 rounded-xl overflow-hidden"
                      style={{ background: '#FFF0E8' }}
                    >
                      <Image src={url} alt={`${item.title} ${i + 1}`} fill className="object-cover" />
                      {i === 2 && item.images.length > 3 && (
                        <div
                          className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: 'rgba(0,0,0,0.45)' }}
                        >
                          +{item.images.length - 3}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: '#FFF0E8' }}
                >
                  🍠
                </div>
              )}

              {/* 내용 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-sm truncate" style={{ color: '#1A1A1A' }}>
                    {item.title}
                  </p>
                  <span
                    className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: item.status === 'selling'  ? '#FFF0E8'
                                : item.status === 'reserved' ? '#FFF3CD'
                                : '#F0F0F0',
                      color:      item.status === 'selling'  ? '#FF6B35'
                                : item.status === 'reserved' ? '#856404'
                                : '#888',
                    }}
                  >
                    {STATUS_LABEL[item.status]}
                  </span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: '#C0A080' }}>
                  {item.category} · {timeAgo(item.created_at)}
                </p>
                <div className="flex items-center justify-between mt-1.5">
                  <p className="font-bold text-sm" style={{ color: '#FF6B35' }}>
                    {formatPrice(item.price)}
                  </p>
                  <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#D4789A' }}>
                    ❤️ {item.likes?.[0]?.count ?? 0}
                  </span>
                </div>
              </div>

              {/* 화살표 */}
              <span className="text-sm" style={{ color: '#FFD0B5' }}>›</span>
            </Link>
          ))}
        </div>
      )}

      {/* 로그아웃 */}
      <form action={signOut} className="mt-2">
        <button
          type="submit"
          className="w-full py-3 rounded-full text-sm font-semibold"
          style={{ background: 'white', border: '1.5px solid #FFD0B5', color: '#C07858' }}
        >
          로그아웃
        </button>
      </form>
    </div>
  )
}
