import { ThreadCard } from '@/components/cards'
import { fetchCommunityPosts } from '@/lib/actions/community.action'
import { fetchUserPosts } from '@/lib/actions/user.action'
import { redirect } from 'next/navigation'
import React from 'react'

interface ThreadsTabProps {
  currentUserId: string
  accountId: string
  accountType: 'User' | 'Community'
}

export default async function ThreadsTab(props: ThreadsTabProps) {
  const { currentUserId, accountId, accountType } = props
  let result: any

  if (accountType === 'Community') {
    result = await fetchCommunityPosts(accountId)
  } else {
    result = await fetchUserPosts(accountId)
  }

  if (!result) return redirect('/')

  return (
    <section className={'mt-9 flex flex-col gap-10'}>
      {result.threads.map((thread: any) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          content={thread.text}
          author={
            accountType === 'User'
              ? { name: result.name, image: result.image, id: result.id }
              : { name: thread.author.name, image: thread.author.image, id: thread.author.id }
          }
          community={thread.community} // TODO: Fix this
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      ))}
    </section>
  )
}
