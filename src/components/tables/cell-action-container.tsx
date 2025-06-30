import { ReactNode } from 'react'

export default function CellActionContainer({ children }: { children: ReactNode }) {
  return <div className="flex items-center justify-end gap-5 px-3">{children}</div>
}
