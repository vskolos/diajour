import { type FormEvent, useState } from 'react'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline'

import type { NextPage } from 'next'
import { api } from '@/utils/api'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Header } from '@/partials'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

const EditEntry: NextPage = () => {
  const router = useRouter()
  const id = router.query.id as string

  const { data: dataEntry } = api.data.getById.useQuery(
    { id },
    {
      onSuccess: (data) => !data && void router.push('/add'),
      onError: (error) => toast.error(error.message),
    }
  )

  const [date, setDate] = useState('')
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('morning')
  const [glucoseAmount, setGlucoseAmount] = useState('')
  const [insulinDosage, setInsulinDosage] = useState('')
  const [weight, setWeight] = useState('')

  const { mutate: addDataEntry } = api.data.add.useMutation({
    onSuccess: () => router.push('/'),
    onError: (error) => toast.error(error.message),
  })

  function handleAddDataEntry(e: FormEvent) {
    e.preventDefault()
    if (!date || !timePeriod || !glucoseAmount) return

    addDataEntry({
      date: new Date(date),
      timePeriod,
      glucoseAmount: Number(glucoseAmount),
      insulinDosage: insulinDosage ? Number(insulinDosage) : null,
      weight: weight ? Number(weight) : null,
    })
  }

  return (
    <>
      <Head>
        <title>Добавить замер</title>
        <meta name="description" content="Добавление замера глюкозы" />
      </Head>
      <Header />
      <main className="flex flex-col items-center justify-center gap-4">
        <form className="grid grid-cols-3 gap-4" onSubmit={handleAddDataEntry}>
          <label className="grid justify-items-start">
            <span className="text-sm">Дата</span>
            <input
              className="rounded border border-neutral-400 px-1"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label className="grid justify-items-start">
            <span className="text-sm">Период</span>
            <select
              className="rounded border border-neutral-400 px-1"
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
            >
              <option value="morning">Утро</option>
              <option value="midday">День</option>
              <option value="evening">Вечер</option>
            </select>
          </label>
          <label className="grid justify-items-start">
            <span className="text-sm">Глюкоза</span>
            <input
              className="rounded border border-neutral-400 px-1"
              type="text"
              inputMode="numeric"
              size={6}
              value={glucoseAmount}
              onChange={(e) =>
                setGlucoseAmount(e.target.value.replaceAll(/[^0-9\.]/g, ''))
              }
            />
          </label>
          <label className="grid justify-items-start">
            <span className="text-sm">Инсулин</span>
            <input
              className="rounded border border-neutral-400 px-1"
              type="text"
              inputMode="numeric"
              size={6}
              value={insulinDosage}
              onChange={(e) =>
                setInsulinDosage(e.target.value.replaceAll(/[^0-9\.]/g, ''))
              }
            />
          </label>
          <label className="grid justify-items-start">
            <span className="text-sm">Вес</span>
            <input
              className="rounded border border-neutral-400 px-1"
              type="text"
              inputMode="numeric"
              size={6}
              value={weight}
              onChange={(e) =>
                setWeight(e.target.value.replaceAll(/[^0-9\.]/g, ''))
              }
            />
          </label>
          <button
            className="col-span-full justify-self-center rounded bg-green-600 py-1 px-2 text-white hover:bg-green-700 focus-visible:bg-green-700 active:bg-green-600 disabled:pointer-events-none disabled:opacity-75"
            type="submit"
            disabled={!glucoseAmount}
          >
            Добавить
          </button>
        </form>
      </main>

      <Link
        href="/"
        className="absolute bottom-4 right-4 rounded-full bg-cyan-600 p-3 text-white hover:bg-cyan-700 focus-visible:bg-cyan-700 active:bg-cyan-600 disabled:pointer-events-none disabled:opacity-75"
      >
        <ArrowUturnLeftIcon className="h-6 w-6" />
      </Link>
    </>
  )
}

export default EditEntry
