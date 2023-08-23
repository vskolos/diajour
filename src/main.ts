import { createTRPCSvelte, httpBatchLink } from 'trpc-svelte-query'
import type { AppRouter } from '../server'
import App from './App.svelte'
import './app.css'

export const trpc = createTRPCSvelte<AppRouter>({
  links: [
    httpBatchLink({
      url: import.meta.env.DEV ? 'http://localhost:3001' : '/trpc',
      fetch: import.meta.env.DEV
        ? (url, options) =>
            fetch(url, {
              ...options,
              credentials: 'include',
            })
        : undefined,
    }),
  ],
  queryClientConfig: {
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60, // 1 minute
      },
    },
  },
})

export default new App({
  target: document.getElementById('app') as HTMLElement,
})
