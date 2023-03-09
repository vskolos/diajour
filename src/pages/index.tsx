import { type NextPage } from 'next'
import Head from 'next/head'
import { signIn, useSession } from 'next-auth/react'

import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import { api } from '@/utils/api'
import { DataEntryRow } from '@/components'
import { Header } from '@/partials'
import { type Data } from '@prisma/client'
import { useCallback, useMemo } from 'react'

const Home: NextPage = () => {
  const { data: sessionData } = useSession()
  const { data: dataEntries } = api.data.getAll.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  })

  const entriesMap = useMemo(() => {
    const map = new Map<string, Data[]>()
    dataEntries?.forEach((entry) =>
      map.get(entry.date.toLocaleDateString())
        ? map.get(entry.date.toLocaleDateString())?.push(entry)
        : map.set(entry.date.toLocaleDateString(), [entry])
    )

    return map
  }, [dataEntries])

  const dateTuple = useCallback((date: Date) => {
    const formattedDateString = new Intl.DateTimeFormat('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }).format(date)

    const [weekDay, dateString] = formattedDateString.split(', ')
    if (!weekDay || !dateString) return ['', '']

    const capitalizedWeekDay = `${weekDay
      .slice(0, 1)
      .toUpperCase()}${weekDay.slice(1)}`

    return [capitalizedWeekDay, dateString]
  }, [])

  return (
    <>
      <Head>
        <title>Diacates</title>
        <meta name="description" content="Отслеживание глюкозы Саманты" />
      </Head>
      <Header />
      <main className="grid gap-6">
        {!sessionData?.user && (
          <div className="absolute inset-0 grid place-items-center">
            <button
              className="grid aspect-square place-items-center rounded-full bg-indigo-600 p-8 text-white hover:bg-indigo-700 focus-visible:bg-indigo-700 active:bg-indigo-600"
              onClick={() => void signIn()}
            >
              <ArrowLeftOnRectangleIcon className="h-6 w-6" />
              Войти
            </button>
          </div>
        )}
        {Array.from(entriesMap).map(([date, entries]) => (
          <div key={date} className="grid overflow-hidden rounded-xl">
            <span className="flex items-center justify-between gap-4 bg-zinc-700 px-6 py-4">
              {dateTuple(new Date(date)).map((item, index) => (
                <span
                  key={index}
                  className="text-xl font-semibold text-zinc-100"
                >
                  {item}
                </span>
              ))}
            </span>
            <ul className="bg-zinc-600">
              {entries
                .sort((a, b) => a.timePeriod.localeCompare(b.timePeriod))
                .map((entry) => (
                  <li key={entry.id} className="px-6 even:bg-zinc-700">
                    <DataEntryRow entry={entry} />
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </main>
    </>
  )
}

export default Home
