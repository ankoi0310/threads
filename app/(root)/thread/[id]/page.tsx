import { ThreadCard } from '@/components/cards'
import { Comment } from '@/components/forms'
import { getThreadById } from '@/lib/actions/thread.action'
import { fetchUser } from '@/lib/actions/user.action'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default async function Page({ params } : { params: { id: string } }) {
  if (!params.id) return null

  const user = await currentUser()
  if (!user) return null

  const userInfo = await fetchUser(user.id)
  if (!userInfo?.onboarded) redirect('/onboarding')

  const thread = await getThreadById(params.id)

  return (
    <section className={'relative'}>
      <div className={''}>
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={user?.id || ''}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      </div>

      <div className={'mt-7'}>
        <Comment
          threadId={thread._id as string}
          currentUserId={JSON.stringify(userInfo._id)}
          currentUserImage={userInfo.image}
        />
      </div>

      <div className={'mt-10'}>
        {thread.children.map((comment: any) => (
          <ThreadCard
            key={comment._id}
            id={comment._id}
            currentUserId={user.id}
            parentId={comment.parentId}
            content={comment.text}
            author={comment.author}
            community={comment.community}
            createdAt={comment.createdAt}
            comments={comment.children}
            isComment
          />
        ))}
      </div>
    </section>
  )
}
