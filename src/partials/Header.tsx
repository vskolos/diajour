import {
  ArrowRightOnRectangleIcon,
  ArrowUturnLeftIcon,
  Bars2Icon,
  Bars4Icon,
  PlusIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { signOut, useSession } from 'next-auth/react'

import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useTableMode } from '@/contexts'

export function Header() {
  const router = useRouter()
  const { data: sessionData } = useSession()
  const [tableMode, setTableMode] = useTableMode()

  if (!sessionData?.user) return null

  return (
    <>
      {!tableMode && <div className="pb-24" />}
      <header
        className={clsx(
          'mx-auto flex w-96 items-center gap-4 rounded-b-xl bg-zinc-800 py-6 px-4',
          !tableMode && 'fixed inset-x-0 top-0'
        )}
      >
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
        {router.pathname === '/' && (
          <button
            className="rounded-full bg-cyan-600 p-3 text-white hover:bg-cyan-700 focus-visible:bg-cyan-700 active:bg-cyan-600 disabled:pointer-events-none disabled:opacity-75"
            onClick={() => setTableMode((tableMode) => !tableMode)}
          >
            {tableMode ? (
              <Bars2Icon className="h-6 w-6" />
            ) : (
              <Bars4Icon className="h-6 w-6" />
            )}
          </button>
        )}
        {router.pathname !== '/' ? (
          <Link
            href="/"
            className="rounded-full bg-cyan-600 p-3 text-white hover:bg-cyan-700 focus-visible:bg-cyan-700 active:bg-cyan-600 disabled:pointer-events-none disabled:opacity-75"
          >
            <ArrowUturnLeftIcon className="h-6 w-6" />
          </Link>
        ) : (
          <Link
            href="/new"
            className="rounded-full bg-emerald-600 p-3 text-white hover:bg-emerald-700 focus-visible:bg-emerald-700 active:bg-emerald-600 disabled:pointer-events-none disabled:opacity-75"
          >
            <PlusIcon className="h-6 w-6" />
          </Link>
        )}
      </header>
    </>
  )
}
