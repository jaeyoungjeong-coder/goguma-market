import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from './ProfileForm'

export default async function ProfileEditPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('nickname, bio, avatar_url')
    .eq('id', user.id)
    .single()

  return (
    <ProfileForm
      initial={{
        nickname:   profile?.nickname ?? '고구마 유저',
        bio:        profile?.bio ?? '',
        avatarUrl:  profile?.avatar_url ?? null,
      }}
    />
  )
}
