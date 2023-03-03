import { type FormEvent, useState } from 'react'

import type { NextPage } from 'next'
import { api } from '@/utils/api'
import Head from 'next/head'
import { useRouter } from 'next/router'

const Add: NextPage = () => {
  const [glucoseAmount, setGlucoseAmount] = useState('')
  const [insulinDosage, setInsulinDosage] = useState('')
  const [weight, setWeight] = useState('')

  const router = useRouter()
  const { mutate: addDataEntry } = api.data.add.useMutation({
    onSuccess: () => router.push('/'),
  })

  function handleAddDataEntry(e: FormEvent) {
    e.preventDefault()
    if (!glucoseAmount) return

    addDataEntry({
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
      <main className="flex flex-col items-center justify-center gap-4">
        <form className="grid grid-cols-3 gap-4" onSubmit={handleAddDataEntry}>
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
    </>
  )
}

export default Add
