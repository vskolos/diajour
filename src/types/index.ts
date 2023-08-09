export type TimePeriod = 'morning' | 'midday' | 'evening'

export type WeekData = {
  dosage: number | null
  weight: number | null
  measurements: {
    date: string
    period: TimePeriod
    glucose: number
  }[]
}
