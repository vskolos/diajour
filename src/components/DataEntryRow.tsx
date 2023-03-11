import type { Data } from '@prisma/client'
import Link from 'next/link'
import clsx from 'clsx'
import { useTableMode } from '@/contexts'

const TimePeriod: Record<TimePeriod, string> = {
  morning: 'Утро',
  midday: 'День',
  evening: 'Вечер',
}

export function DataEntryRow({ entry }: { entry: Data }) {
  const [tableMode] = useTableMode()

  return (
    <Link href={`/${entry.id}`} className="grid grid-cols-4 items-center gap-2">
      <span
        className={clsx('font-medium text-zinc-100', !tableMode && 'text-lg')}
      >
        {TimePeriod[entry.timePeriod as TimePeriod]}
      </span>
      <div
        className={clsx(
          'grid justify-items-center',
          tableMode ? 'p-1' : 'p-2',
          entry.glucoseAmount < 2
            ? 'bg-red-600'
            : entry.glucoseAmount < 6
            ? 'bg-orange-600'
            : entry.glucoseAmount < 18
            ? 'bg-green-600'
            : entry.glucoseAmount < 26
            ? 'bg-sky-600'
            : 'bg-purple-600'
        )}
      >
        <span
          className={clsx(
            'font-medium text-white',
            tableMode && 'text-lg leading-none',
            !tableMode && 'text-xl'
          )}
        >
          {entry.glucoseAmount}
        </span>
        {!tableMode && <span className="text-xs text-zinc-200">ммоль/л</span>}
      </div>
      <div className="grid justify-items-center">
        {entry.insulinDosage !== null && (
          <>
            <span
              className={clsx(
                'font-medium text-zinc-100',
                tableMode ? 'text-lg leading-none' : 'text-xl'
              )}
            >
              {entry.insulinDosage}
            </span>
            {!tableMode && <span className="text-xs text-zinc-300">ед</span>}
          </>
        )}
      </div>
      <div className="grid justify-items-center">
        {entry.weight !== null && (
          <>
            <span
              className={clsx(
                'font-medium text-zinc-100',
                tableMode ? 'text-lg leading-none' : 'text-xl'
              )}
            >
              {entry.weight}
            </span>
            {!tableMode && <span className="text-xs text-zinc-300">кг</span>}
          </>
        )}
      </div>
    </Link>
  )
}
