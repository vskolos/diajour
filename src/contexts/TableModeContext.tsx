import { type ReactNode, createContext, useContext, useState } from 'react'

const TableModeContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined)

export function useTableMode() {
  const context = useContext(TableModeContext)
  if (context === undefined)
    throw new Error('useTableMode must be used within an TableModeProvider')
  return context
}

export function TableModeProvider({ children }: { children: ReactNode }) {
  const tableMode = useState(false)
  return (
    <TableModeContext.Provider value={tableMode}>
      {children}
    </TableModeContext.Provider>
  )
}
