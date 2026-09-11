import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { LayoutGrid, Plus, List, Settings as SettingsIcon } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const NAV_ITEMS = [
  { to: '/', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/add', label: 'Add expense', icon: Plus, end: false },
  { to: '/history', label: 'History', icon: List, end: false },
  { to: '/settings', label: 'Settings', icon: SettingsIcon, end: false },
]

export default function Layout() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-paper md:flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:border-line md:bg-surface md:px-5 md:py-6">
        <div className="mb-8 px-1">
          <span className="font-serif text-[22px] leading-none text-ink">Ledger</span>
          <p className="mt-1 text-[12px] text-ink-faint truncate">{user?.email}</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded px-3 py-2 text-[14px] font-medium transition-colors ${
                  isActive
                    ? 'bg-pine-50 text-pine-600'
                    : 'text-ink-muted hover:bg-pine-50 hover:text-ink'
                }`
              }
            >
              <item.icon size={17} strokeWidth={2} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1">
        {/* Mobile top bar */}
        <header className="flex items-center justify-between border-b border-line bg-surface px-4 py-3 md:hidden">
          <span className="font-serif text-[19px] leading-none text-ink">Ledger</span>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-6 pb-24 md:px-8 md:py-8 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-10 flex border-t border-line bg-surface md:hidden">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
                isActive ? 'text-pine-600' : 'text-ink-faint'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} strokeWidth={isActive ? 2.4 : 2} />
                {item.label === 'Add expense' ? 'Add' : item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
