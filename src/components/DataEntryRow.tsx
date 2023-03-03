import type { Data } from '@prisma/client'

export function DataEntryRow({ entry }: { entry: Data }) {
  return (
    <div className="flex items-center gap-4">
      <span className="font-medium">{entry.glucoseAmount?.toString()}</span>
      <span className="font-medium">{entry.insulinDosage?.toString()}</span>
      <span className="font-medium">{entry.weight?.toString()}</span>
    </div>
  )
}
