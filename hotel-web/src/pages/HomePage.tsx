import { ArrowRight, CalendarCheck, Search, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router'

const features = [
    {
        title: 'Búsqueda sencilla',
        description:
            'Consulta hoteles y disponibilidad desde una interfaz rápida y moderna.',
        icon: Search,
    },
    {
        title: 'Reservaciones centralizadas',
        description:
            'Crea y consulta reservaciones conectadas con los servicios de la plataforma.',
        icon: CalendarCheck,
    },
    {
        title: 'Arquitectura segura',
        description:
            'Las solicitudes serán procesadas mediante el API Gateway y protegidas con JWT.',
        icon: ShieldCheck,
    },
]

function HomePage() {
    return (
        <>
            <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500">
                <div className="mx-auto grid min-h-[560px] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
                    <div className="text-white">
                        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-blue-100">
                            Plataforma hotelera
                        </p>

                        <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                            Encuentra y reserva tu próxima estancia
                        </h1>

                        <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
                            Consulta hoteles, verifica disponibilidad y administra tus
                            reservaciones desde una sola aplicación.
                        </p>

                        <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                            <Link
                                to="/hotels"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
                            >
                                Explorar hoteles
                                <ArrowRight size={19} />
                            </Link>

                            <Link
                                to="/reservations"
                                className="inline-flex items-center justify-center rounded-xl border border-white/60 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                            >
                                Mis reservaciones
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
                        <div className="rounded-2xl bg-white p-7">
                            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                                Búsqueda rápida
                            </p>

                            <h2 className="mt-2 text-2xl font-bold text-slate-900">
                                Planea tu estancia
                            </h2>

                            <div className="mt-6 space-y-4">
                                <div>
                                    <label
                                        htmlFor="destination"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Destino
                                    </label>

                                    <input
                                        id="destination"
                                        type="text"
                                        placeholder="Ej. Tapachula, Chiapas"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>

                                <button
                                    type="button"
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                                >
                                    <Search size={19} />
                                    Buscar hoteles
                                </button>
                            </div>

                            <p className="mt-4 text-center text-xs text-slate-500">
                                La búsqueda será conectada al backend en los próximos pasos.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-20">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                        Una plataforma completa
                    </p>

                    <h2 className="mt-3 text-3xl font-bold text-slate-900">
                        Todo lo necesario para gestionar una reservación
                    </h2>
                </div>

                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    {features.map((feature) => {
                        const Icon = feature.icon

                        return (
                            <article
                                key={feature.title}
                                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                    <Icon size={24} />
                                </div>

                                <h3 className="mt-5 text-xl font-bold text-slate-900">
                                    {feature.title}
                                </h3>

                                <p className="mt-3 leading-7 text-slate-600">
                                    {feature.description}
                                </p>
                            </article>
                        )
                    })}
                </div>
            </section>
        </>
    )
}

export default HomePage