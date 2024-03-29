import { startOfWeek } from 'date-fns'
import { writable } from 'svelte/store'

export const weekStart = writable(startOfWeek(new Date(), { weekStartsOn: 1 }))

const localStorageMode = localStorage.getItem('mode')
export const mode = writable<'table' | 'chart'>(
  localStorageMode === 'table' || localStorageMode === 'chart'
    ? localStorageMode
    : 'table'
)

const isLoggedIn = document.cookie.includes('sessionId')
export const loggedIn = writable(isLoggedIn)
