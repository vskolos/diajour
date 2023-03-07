import {
  ArrowRightOnRectangleIcon,
  ArrowUturnLeftIcon,
  PlusIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { signOut, useSession } from 'next-auth/react'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

export function Header() {
  const router = useRouter()
  const { data: sessionData } = useSession()

  if (!sessionData) return null

  return (
    <>
      <div className="pb-20" />
      <header className="fixed inset-x-0 top-0 mx-auto flex w-96 items-center gap-4 rounded-b-xl bg-zinc-800 p-4">
        <button
          className="rounded-full bg-gray-600 p-3 text-white hover:bg-gray-700 focus-visible:bg-gray-700 active:bg-gray-600 disabled:pointer-events-none disabled:opacity-75"
          onClick={() => void signOut()}
        >
          <ArrowRightOnRectangleIcon className="h-6 w-6" />
        </button>
        <div className="relative grid h-12 w-12 items-center justify-items-center overflow-hidden rounded-full bg-gray-600">
          {sessionData.user.image ? (
            <Image
              sizes="3rem"
              fill={true}
              src={sessionData.user.image}
              alt="Аватар пользователя"
              priority
            />
          ) : (
            <UserIcon className="h-6 w-6 text-white" />
          )}
        </div>
        <span className="flex-grow text-zinc-200">
          {sessionData.user.name ?? ''}
        </span>
        {router.pathname.startsWith('/add') ||
        router.pathname.startsWith('/edit') ? (
          <Link
            href="/"
            className="absolute bottom-4 right-4 rounded-full bg-cyan-600 p-3 text-white hover:bg-cyan-700 focus-visible:bg-cyan-700 active:bg-cyan-600 disabled:pointer-events-none disabled:opacity-75"
          >
            <ArrowUturnLeftIcon className="h-6 w-6" />
          </Link>
        ) : (
          <Link
            href="/add"
            className="rounded-full bg-emerald-600 p-3 text-white hover:bg-emerald-700 focus-visible:bg-emerald-700 active:bg-emerald-600 disabled:pointer-events-none disabled:opacity-75"
          >
            <PlusIcon className="h-6 w-6" />
          </Link>
        )}
      </header>
    </>
  )
}
