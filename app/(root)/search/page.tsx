import { UserCard } from '@/components/cards'
import { Pagination } from '@/components/shared'
import SearchBar from '@/components/shared/SearchBar'
import { fetchUser, fetchUsers } from '@/lib/actions/user.action'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default async function Page({ searchParams } : { searchParams: { [key: string]: string | undefined} }) {
  const user = await currentUser()

  if (!user) return null

  const userInfo = await fetchUser(user.id)

  if (!userInfo?.onboarded) redirect('/onboarding')

  // Fetch users
  const result = await fetchUsers({
    userId: user.id,
    searchString: searchParams.q,
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 25,
  })

  return (
    <section>
      <h1 className={'head-text mb-10'}>Search</h1>

      <SearchBar routeType='search' />

      <div className={'mt-14 flex flex-col gap-9'}>
        {result.users.length === 0 ? (
          <p className={'no-result'}>No users</p>
        ) : (
          <>
            {result.users.map((user) => (
              <UserCard
                key={user.id}
                id={user.id}
                name={user.name}
                username={user.username}
                image={user.image}
                accountType={'User'}
              />
            ))}
          </>
        )}
      </div>

      <Pagination
        path='search'
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </section>
  )
}
