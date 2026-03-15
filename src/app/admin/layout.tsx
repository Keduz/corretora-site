'use client'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-sand-50 font-body antialiased">
      {children}
    </div>
  )
}
