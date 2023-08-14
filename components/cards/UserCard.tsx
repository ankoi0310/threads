'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface UserCardProps {
  id: string
  name: string
  username: string
  image: string
  accountType: 'User' | 'Organization'
}

export default function UserCard(props: UserCardProps) {
  const { id, name, username, image, accountType } = props
  const router = useRouter()

  return (
    <article className={'user-card'}>
      <div className={'user-card_avatar'}>
        <Image
          src={image}
          alt={'logo'}
          width={48}
          height={48}
          className={'rounded-full'}
        />

        <div className={'flex-1 text-ellipsis'}>
          <h4 className={'text-base-semibold text-light-1'}>{name}</h4>
          <p className={'text-small-medium text-gray-1'}>@{username}</p>
        </div>
      </div>

      <Button
        className={'user-card_btn'}
        onClick={() => router.push(`/profile/${id}`)}
      >View</Button>
    </article>
  )
}
