'use client'

import { usePathname } from 'next/navigation'
import { type ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppFloat from './WhatsAppFloat'
import CompareBar from './CompareBar'
import LeadPopup from './LeadPopup'

export default function ConditionalShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <CompareBar />
      <WhatsAppFloat />
      <LeadPopup />
    </>
  )
}
