import { startOfWeek } from 'date-fns'
import { writable } from 'svelte/store'

export const weekStart = writable(startOfWeek(new Date()))
