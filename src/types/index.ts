export type WeekData = {
  dosage: number | null
  weight: number | null
  measurements: {
    date: string
    period: 'morning' | 'midday' | 'evening'
    glucose: number
  }[]
}
