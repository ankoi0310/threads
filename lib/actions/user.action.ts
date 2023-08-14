'use server'

import Community from '@/lib/models/community.model'
import Thread from '@/lib/models/thread.model'
import User from '@/lib/models/user.model'
import { connectToDatabase } from '@/lib/mongoose'
import { FilterQuery, SortOrder } from 'mongoose'
import { revalidatePath } from 'next/cache'

interface UserUpdateRequest {
  userId: string,
  username: string,
  name: string,
  bio: string,
  image: string,
  path: string
}

export async function updateUser(userUpdateRequest: UserUpdateRequest) {
  const { userId, username, name, bio, image, path } = userUpdateRequest

  try {
    connectToDatabase()

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true },
    )

    if (path === '/profile/edit') {
      revalidatePath(path)
    }
  } catch (error: any) {
    console.log('Failed to update user: ', error)
    throw error
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDatabase()

    return await User
      .findOne({ id: userId })
      .populate({
        path: 'communities',
        model: Community,
      })
  } catch (error: any) {
    console.log('Failed to fetch user: ', error)
    throw error
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDatabase()

    // Find all threads authored by user with the given userId
    return await User
      .findOne({ id: userId })
      .populate({
        path: 'threads',
        model: Thread,
        populate: [
          {
            path: 'community',
            model: Community,
            select: 'name image id _id',
          },
          {
            path: 'children',
            model: Thread,
            populate: {
              path: 'author',
              model: User,
              select: 'name image id',
            },
          }
        ],
      })
  } catch (error: any) {
    console.log('Failed to fetch user posts: ', error)
    throw error
  }
}

interface UserSearch {
  userId: string
  searchString?: string
  pageNumber?: number
  pageSize?: number
  sortBy?: SortOrder
}

export async function fetchUsers(userSearch: UserSearch) {
  const { userId, searchString = '', pageNumber = 1, pageSize = 20, sortBy = 'desc' } = userSearch
  try {
    connectToDatabase()

    const skipAmount = (pageNumber - 1) * pageSize

    const regex = new RegExp(searchString, 'i')

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    }

    if (searchString.trim() !== '') {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ]
    }

    const sortOptions = { createAt: sortBy }

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)

    const totalUsersCount = await User.countDocuments(query)

    const users = await usersQuery.exec()

    const isNext = totalUsersCount > skipAmount + users.length

    return { users, isNext }
  } catch (error: any) {
    console.log('Failed to fetch users: ', error)
    throw error
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDatabase()

    // Find all threads created by user
    const userThreads = await Thread.find({ author: userId })

    // Collect all the child thread ids (replies) from the 'children' field
    const childThreadIds = userThreads.reduce((acc, thread) => {
      return acc.concat(thread.children)
    }, [])

    return await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId }
    }).populate({
      path: 'author',
      model: User,
      select: 'name image _id',
    })
  } catch (error: any) {
    console.log('Failed to fetch activity: ', error)
    throw error
  }
}
