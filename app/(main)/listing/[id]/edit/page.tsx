import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import EditForm from './EditForm'

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: listing } = await supabase
    .from('listings')
    .select('id, title, category, price, description, images, user_id')
    .eq('id', id)
    .single()

  if (!listing) notFound()

  // 본인 글이 아니면 상세 페이지로 돌려보냄
  if (listing.user_id !== user.id) redirect(`/listing/${id}`)

  return (
    <EditForm
      id={listing.id}
      initial={{
        title:       listing.title,
        category:    listing.category,
        price:       listing.price,
        description: listing.description,
        images:      listing.images ?? [],
      }}
    />
  )
}
