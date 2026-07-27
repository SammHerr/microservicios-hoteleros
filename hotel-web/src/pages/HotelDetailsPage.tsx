import { useQuery } from '@tanstack/react-query'
import {
    ArrowLeft,
    BedDouble,
    Building2,
    CalendarDays,
    MapPin,
    RefreshCw,
    ShieldCheck,
    Star,
} from 'lucide-react'
import { Link, useParams } from 'react-router'
import { getHotelById } from '../api/hotelApi'

function HotelDetailsPage() {
    const { hotelId } = useParams()

    const numericHotelId = Number(hotelId)
    const isValidHotelId =
        Number.isInteger(numericHotelId) && numericHotelId > 0

    const {
        data: hotel,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ['hotel', numericHotelId],
        queryFn: () => getHotelById(numericHotelId),
        enabled: isValidHotelId,
    })

    if (!isValidHotelId) {
        return (
            <section className="mx-auto min-h-[70vh] max-w-7xl px-6 py-16">
                <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">
                    <h1 className="text-xl font-bold">
                        Identificador de hotel inválido
                    </h1>

                    <p className="mt-2">
                        La dirección solicitada no contiene un identificador válido.
                    </p>

                    <Link
                        to="/hotels"
                        className="mt-6 inline-flex items-center gap-2 font-semibold text-blue-600"
                    >
                        <ArrowLeft size={18} />
                        Volver al catálogo
                    </Link>
                </div>
            </section>
        )
    }

    if (isLoading) {
        return (
            <section className="mx-auto min-h-[70vh] max-w-7xl animate-pulse px-6 py-16">
                <div className="h-5 w-40 rounded bg-slate-200" />
                <div className="mt-8 h-80 rounded-3xl bg-slate-200" />

                <div className="mt-8 grid gap-7 lg:grid-cols-3">
                    <div className="h-72 rounded-2xl bg-slate-200 lg:col-span-2" />
                    <div className="h-72 rounded-2xl bg-slate-200" />
                </div>
            </section>
        )
    }

    if (isError || !hotel) {
        return (
            <section className="mx-auto min-h-[70vh] max-w-7xl px-6 py-16">
                <Link
                    to="/hotels"
                    className="inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700"
                >
                    <ArrowLeft size={18} />
                    Volver al catálogo
                </Link>

                <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">
                    <h1 className="text-xl font-bold">
                        No fue posible consultar el hotel
                    </h1>

                    <p className="mt-2 text-sm">
                        {error instanceof Error
                            ? error.message
                            : 'Ocurrió un error desconocido.'}
                    </p>

                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
                    >
                        <RefreshCw size={17} />
                        Reintentar
                    </button>
                </div>
            </section>
        )
    }

    return (
        <section className="mx-auto min-h-[70vh] max-w-7xl px-6 py-12">
            <Link
                to="/hotels"
                className="inline-flex items-center gap-2 font-semibold text-blue-600 transition hover:text-blue-700"
            >
                <ArrowLeft size={18} />
                Volver al catálogo
            </Link>

            <div className="relative mt-8 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 px-8 py-14 text-white shadow-xl md:px-12">
                <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10" />
                <div className="absolute -bottom-20 right-32 h-56 w-56 rounded-full bg-cyan-300/10" />

                <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-3xl">
                        <div className="flex flex-wrap items-center gap-3">
                            <span
                                className={[
                                    'rounded-full px-3 py-1 text-sm font-semibold',
                                    hotel.active
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-slate-200 text-slate-700',
                                ].join(' ')}
                            >
                                {hotel.active ? 'Hotel disponible' : 'Hotel no disponible'}
                            </span>

                            <span className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                                <Star size={16} fill="currentColor" />
                                {hotel.stars} estrellas
                            </span>
                        </div>

                        <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl">
                            {hotel.name}
                        </h1>

                        <p className="mt-5 flex items-start gap-2 text-lg text-blue-50">
                            <MapPin size={22} className="mt-0.5 shrink-0" />
                            {hotel.address}, {hotel.city}
                        </p>
                    </div>

                    <div className="flex h-32 w-32 shrink-0 items-center justify-center self-center rounded-3xl border border-white/20 bg-white/10 backdrop-blur-sm">
                        <Building2 size={70} strokeWidth={1.4} />
                    </div>
                </div>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-3">
                <div className="space-y-8 lg:col-span-2">
                    <article className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                            Acerca del hotel
                        </p>

                        <h2 className="mt-3 text-2xl font-bold text-slate-900">
                            Información general
                        </h2>

                        <p className="mt-5 text-lg leading-8 text-slate-600">
                            {hotel.description}
                        </p>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                <BedDouble size={25} />
                            </div>

                            <div>
                                <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                                    Habitaciones
                                </p>

                                <h2 className="text-2xl font-bold text-slate-900">
                                    Consultar disponibilidad
                                </h2>
                            </div>
                        </div>

                        <p className="mt-5 leading-7 text-slate-600">
                            En el siguiente paso mostraremos las habitaciones disponibles
                            según el tipo de habitación y la fecha seleccionada.
                        </p>

                        <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                            <CalendarDays
                                size={40}
                                className="mx-auto text-blue-600"
                            />

                            <p className="mt-4 font-semibold text-slate-900">
                                Módulo de disponibilidad
                            </p>

                            <p className="mt-2 text-sm text-slate-500">
                                Pendiente de conectar con availability-service.
                            </p>
                        </div>
                    </article>
                </div>

                <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-7 shadow-sm lg:sticky lg:top-8">
                    <h2 className="text-xl font-bold text-slate-900">
                        Planea tu reservación
                    </h2>

                    <p className="mt-3 leading-7 text-slate-600">
                        Consulta las fechas y habitaciones disponibles antes de crear tu
                        reservación.
                    </p>

                    <div className="mt-6 space-y-4">
                        <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                            <ShieldCheck
                                size={21}
                                className="mt-0.5 shrink-0 text-emerald-600"
                            />

                            <div>
                                <p className="font-semibold text-slate-900">
                                    Proceso seguro
                                </p>

                                <p className="mt-1 text-sm leading-6 text-slate-500">
                                    Las solicitudes se procesan mediante el API Gateway.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                            <CalendarDays
                                size={21}
                                className="mt-0.5 shrink-0 text-blue-600"
                            />

                            <div>
                                <p className="font-semibold text-slate-900">
                                    Disponibilidad actualizada
                                </p>

                                <p className="mt-1 text-sm leading-6 text-slate-500">
                                    La disponibilidad se consultará directamente en el backend.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        disabled
                        className="mt-7 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-300 px-5 py-3 font-semibold text-slate-600"
                    >
                        Consultar habitaciones
                    </button>
                </aside>
            </div>
        </section>
    )
}

export default HotelDetailsPage