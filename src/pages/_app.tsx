import { type AppType } from 'next/app'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

import { api } from '@/utils/api'

import '@/styles/globals.css'
import { Toaster } from 'react-hot-toast'
import { TableModeProvider } from '@/contexts'

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <TableModeProvider>
        <Component {...pageProps} />
        <Toaster />
      </TableModeProvider>
    </SessionProvider>
  )
}

export default api.withTRPC(MyApp)
