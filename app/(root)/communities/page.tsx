import { CommunityCard } from '@/components/cards'
import { Pagination } from '@/components/shared'
import SearchBar from '@/components/shared/SearchBar'
import { fetchCommunities } from '@/lib/actions/community.action'
import { fetchUser } from '@/lib/actions/user.action'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default async function Page({ searchParams } : {
  searchParams: { [key: string]: string | undefined}
}) {
  const user = await currentUser()

  if (!user) return null

  const userInfo = await fetchUser(user.id)

  if (!userInfo?.onboarded) redirect('/onboarding')

  // Fetch communities
  const result = await fetchCommunities({
    searchString: searchParams.q,
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 25,
  })

  return (
    <section>
      <h1 className={'head-text'}>Communities</h1>

      <div className='mt-5'>
        <SearchBar routeType='communities' />
      </div>

      <section className='mt-9 flex flex-wrap gap-4'>
        {result.communities.length === 0 ? (
          <p className='no-result'>No Result</p>
        ) : (
          <>
            {result.communities.map((community) => (
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                username={community.username}
                image={community.image}
                bio={community.bio}
                members={community.members}
              />
            ))}
          </>
        )}
      </section>

      <Pagination
        path='communities'
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </section>
  )
}
