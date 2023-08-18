export type TimePeriod = 'morning' | 'midday' | 'evening'

export type WeekData = {
  dosage: number | null
  weight: number | null
  entries: {
    date: string
    period: TimePeriod
    glucose: number
  }[]
}
