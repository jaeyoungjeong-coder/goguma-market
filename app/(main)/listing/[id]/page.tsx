import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { OwnerActionBar, BuyerActionBar } from './ActionBar'
import ImageGallery from './ImageGallery'
import LikeButton from './LikeButton'
import CommentsSection from './CommentsSection'

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

const CATEGORY_EMOJI: Record<string, string> = {
  '디지털/가전': '💻', '가구/인테리어': '🪑', '의류/잡화': '👗',
  '도서/티켓': '📚',  '스포츠/레저': '⚽',  '뷰티/미용': '💄',
  '생활/주방': '🍳',  '기타': '📦',
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 판매글 조회
  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single()

  if (!listing) notFound()

  // 판매자 닉네임 조회
  const { data: profile } = await supabase
    .from('profiles')
    .select('nickname')
    .eq('id', listing.user_id)
    .single()

  const isOwner  = user.id === listing.user_id
  const nickname = profile?.nickname ?? '고구마 유저'
  const catEmoji = CATEGORY_EMOJI[listing.category] ?? '📦'

  // 좋아요 수 + 내가 눌렀는지 여부
  const { count: likeCount } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('listing_id', listing.id)

  const { data: myLike } = await supabase
    .from('likes')
    .select('id')
    .eq('listing_id', listing.id)
    .eq('user_id', user.id)
    .maybeSingle()

  // 댓글 목록
  const { data: comments } = await supabase
    .from('comments')
    .select('id, content, created_at, user_id, profiles(nickname)')
    .eq('listing_id', listing.id)
    .order('created_at', { ascending: true })

  return (
    <div className="flex flex-col gap-0 pb-28">
      {/* 뒤로가기 */}
      <div className="flex items-center gap-3 mb-4">
        <Link
          href="/home"
          className="w-9 h-9 flex items-center justify-center rounded-full text-lg"
          style={{ background: 'white', border: '1.5px solid #FFD0B5', color: '#FF6B35' }}
        >
          ←
        </Link>
        <span className="font-bold text-base" style={{ color: '#2D1A0E' }}>상품 상세</span>
      </div>

      {/* 이미지 */}
      {listing.images?.length ? (
        <ImageGallery images={listing.images} alt={listing.title} />
      ) : (
        <div
          className="w-full aspect-square rounded-3xl flex flex-col items-center justify-center mb-5"
          style={{ background: 'linear-gradient(135deg, #FFF0E8, #FFE4D6)' }}
        >
          <span className="text-7xl">{catEmoji}</span>
          <p className="text-xs mt-3" style={{ color: '#C0A080' }}>사진이 없는 상품이에요</p>
        </div>
      )}

      {/* 상태 + 카테고리 */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-xs px-3 py-1 rounded-full font-semibold"
          style={{
            background: listing.status === 'selling'  ? '#FFF0E8'
                      : listing.status === 'reserved' ? '#FFF3CD'
                      : '#F0F0F0',
            color:      listing.status === 'selling'  ? '#FF6B35'
                      : listing.status === 'reserved' ? '#856404'
                      : '#888',
          }}
        >
          {listing.status === 'selling' ? '판매중 🟠' : listing.status === 'reserved' ? '예약중 🟡' : '판매완료 ⚫'}
        </span>
        <span
          className="text-xs px-3 py-1 rounded-full font-medium"
          style={{ background: '#F5F5F5', color: '#888' }}
        >
          {listing.category}
        </span>
      </div>

      {/* 제목 */}
      <h1 className="text-xl font-extrabold mb-2" style={{ color: '#1A1A1A' }}>
        {listing.title}
      </h1>

      {/* 가격 + 좋아요 */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-2xl font-extrabold" style={{ color: '#FF6B35' }}>
          {formatPrice(listing.price)}
        </p>
        <LikeButton listingId={listing.id} initialLiked={!!myLike} initialCount={likeCount ?? 0} />
      </div>

      {/* 판매자 정보 */}
      <div
        className="flex items-center gap-3 p-3 rounded-2xl mb-5"
        style={{ background: '#FFFAF7', border: '1px solid #FFE4D6' }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
          style={{ background: 'linear-gradient(135deg, #FF6B35, #FF3D9A)' }}
        >
          🍠
        </div>
        <div>
          <p className="font-bold text-sm" style={{ color: '#1A1A1A' }}>{nickname}</p>
          <p className="text-xs" style={{ color: '#C0A080' }}>
            {timeAgo(listing.created_at)} 등록
          </p>
        </div>
        {isOwner && (
          <span
            className="ml-auto text-xs px-2 py-1 rounded-full font-semibold"
            style={{ background: '#FFF0E8', color: '#FF6B35' }}
          >
            내 글
          </span>
        )}
      </div>

      {/* 구분선 */}
      <div style={{ height: '1px', background: '#FFE4D6', marginBottom: '1.25rem' }} />

      {/* 설명 */}
      <h2 className="text-sm font-bold mb-2" style={{ color: '#A0622E' }}>상품 설명</h2>
      {listing.description ? (
        <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#4A4A4A' }}>
          {listing.description}
        </p>
      ) : (
        <p className="text-sm" style={{ color: '#CCC' }}>등록된 설명이 없어요.</p>
      )}

      {/* 구분선 */}
      <div style={{ height: '1px', background: '#FFE4D6', margin: '1.25rem 0' }} />

      {/* 댓글 */}
      <CommentsSection
        listingId={listing.id}
        currentUserId={user.id}
        comments={comments ?? []}
      />

      {/* 하단 액션 바 */}
      {isOwner ? <OwnerActionBar id={listing.id} /> : <BuyerActionBar />}
    </div>
  )
}
