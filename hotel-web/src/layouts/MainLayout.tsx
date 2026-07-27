import { BedDouble, CalendarDays, Hotel, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router'

// Opciones principales de navegación de la plataforma.
const navigationItems = [
    {
        label: 'Inicio',
        path: '/',
        icon: Hotel,
    },
    {
        label: 'Hoteles',
        path: '/hotels',
        icon: BedDouble,
    },
    {
        label: 'Reservaciones',
        path: '/reservations',
        icon: CalendarDays,
    },
]

function MainLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="border-b border-slate-200 bg-white shadow-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <Link
                        to="/"
                        className="flex items-center gap-3"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                            <Hotel size={24} />
                        </div>

                        <div>
                            <p className="text-lg font-bold text-slate-900">
                                Hotel Platform
                            </p>

                            <p className="text-xs text-slate-500">
                                Microservicios hoteleros
                            </p>
                        </div>
                    </Link>

                    <nav className="hidden items-center gap-2 md:flex">
                        {navigationItems.map((item) => {
                            const Icon = item.icon

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        [
                                            'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition',
                                            isActive
                                                ? 'bg-blue-600 text-white'
                                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                                        ].join(' ')
                                    }
                                >
                                    <Icon size={18} />
                                    {item.label}
                                </NavLink>
                            )
                        })}
                    </nav>

                    <button
                        type="button"
                        className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 md:hidden"
                        onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
                        aria-label="Abrir menú de navegación"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {isMenuOpen && (
                    <nav className="border-t border-slate-200 bg-white px-6 py-4 md:hidden">
                        <div className="flex flex-col gap-2">
                            {navigationItems.map((item) => {
                                const Icon = item.icon

                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={({ isActive }) =>
                                            [
                                                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition',
                                                isActive
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-slate-600 hover:bg-slate-100',
                                            ].join(' ')
                                        }
                                    >
                                        <Icon size={19} />
                                        {item.label}
                                    </NavLink>
                                )
                            })}
                        </div>
                    </nav>
                )}
            </header>

            <main>
                <Outlet />
            </main>

            <footer className="border-t border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-6 py-6 text-center text-sm text-slate-500">
                    Plataforma de reservaciones basada en microservicios.
                </div>
            </footer>
        </div>
    )
}

export default MainLayout