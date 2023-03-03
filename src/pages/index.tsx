import { type NextPage } from 'next'
import Head from 'next/head'
import { signIn, signOut, useSession } from 'next-auth/react'

import { api } from '@/utils/api'
import { DataEntryRow } from '@/components'
import Link from 'next/link'
import Image from 'next/image'

const Home: NextPage = () => {
  const { data: sessionData } = useSession()
  const { data: dataEntries } = api.data.getAll.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  })

  return (
    <>
      <Head>
        <title>Diacates</title>
        <meta name="description" content="Отслеживание глюкозы Саманты" />
      </Head>
      {sessionData?.user && (
        <header className="flex items-center gap-4 p-4">
          <div className="relative grid h-12 w-12 items-center justify-items-center overflow-hidden rounded-full bg-gray-600">
            {sessionData.user.image ? (
              <Image
                fill={true}
                src={sessionData.user.image}
                alt="Аватар пользователя"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            )}
          </div>
          {sessionData.user.name && (
            <span className="flex-grow text-neutral-200">
              {sessionData.user.name}
            </span>
          )}
          <button
            className="rounded-full bg-gray-600 p-3 text-white hover:bg-gray-700 focus-visible:bg-gray-700 active:bg-gray-600 disabled:pointer-events-none disabled:opacity-75"
            onClick={() => void signOut()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
          </button>
        </header>
      )}
      <main className="flex flex-col items-center justify-center gap-4">
        {!sessionData?.user && (
          <div className="absolute inset-0 grid place-items-center">
            <button
              className="grid aspect-square place-items-center rounded-full bg-indigo-600 p-8 text-white hover:bg-indigo-700 focus-visible:bg-indigo-700 active:bg-indigo-600"
              onClick={() => void signIn()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
              Войти
            </button>
          </div>
        )}
        {dataEntries && (
          <ul>
            {dataEntries.map((entry) => (
              <li key={entry.id}>
                <DataEntryRow entry={entry} />
              </li>
            ))}
          </ul>
        )}
      </main>

      {sessionData?.user && (
        <Link
          href="/add"
          className="absolute bottom-4 right-4 rounded-full bg-emerald-600 p-3 text-white hover:bg-emerald-700 focus-visible:bg-emerald-700 active:bg-emerald-600 disabled:pointer-events-none disabled:opacity-75"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </Link>
      )}
    </>
  )
}

export default Home
