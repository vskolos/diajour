import type { Data } from '@prisma/client'
import Link from 'next/link'
import clsx from 'clsx'

const TimePeriod: Record<TimePeriod, string> = {
  morning: 'Утро',
  midday: 'День',
  evening: 'Вечер',
}

export function DataEntryRow({ entry }: { entry: Data }) {
  return (
    <Link href={`/${entry.id}`} className="grid grid-cols-4 items-center gap-2">
      <span className="text-lg font-medium text-zinc-100">
        {TimePeriod[entry.timePeriod as TimePeriod]}
      </span>
      <div
        className={clsx(
          'grid justify-items-center p-2',
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
        <span className="text-xl font-medium text-white">
          {entry.glucoseAmount}
        </span>
        <span className="text-xs text-zinc-200">ммоль/л</span>
      </div>
      <div className="grid justify-items-center">
        {entry.insulinDosage !== null && (
          <>
            <span className="text-xl font-medium text-zinc-100">
              {entry.insulinDosage}
            </span>
            <span className="text-xs text-zinc-300">ед</span>
          </>
        )}
      </div>
      <div className="grid justify-items-center">
        {entry.weight !== null && (
          <>
            <span className="text-xl font-medium text-zinc-100">
              {entry.weight}
            </span>
            <span className="text-xs text-zinc-300">кг</span>
          </>
        )}
      </div>
    </Link>
  )
}
