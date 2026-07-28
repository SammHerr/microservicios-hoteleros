import { useMutation, useQuery } from '@tanstack/react-query'
import {
    ArrowLeft,
    BedDouble,
    Building2,
    CalendarCheck,
    CalendarDays,
    CheckCircle2,
    LoaderCircle,
    MapPin,
    RefreshCw,
    Search,
    ShieldCheck,
    Star,
    XCircle,
} from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router'
import {
    checkAvailability,
    type AvailabilityCheckResponse,
} from '../api/availabilityApi'
import { getHotelById } from '../api/hotelApi'

function getToday(): string {
    const today = new Date()
    const timezoneOffset = today.getTimezoneOffset() * 60_000

    return new Date(today.getTime() - timezoneOffset)
        .toISOString()
        .split('T')[0]
}

function HotelDetailsPage() {
    const { hotelId } = useParams()

    const numericHotelId = Number(hotelId)
    const isValidHotelId =
        Number.isInteger(numericHotelId) && numericHotelId > 0

    const [roomType, setRoomType] = useState('SENCILLA')
    const [selectedDate, setSelectedDate] = useState('')
    const [formError, setFormError] = useState<string | null>(null)

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

    const {
        mutate: consultAvailability,
        data: availability,
        isPending: isCheckingAvailability,
        isError: isAvailabilityError,
        error: availabilityError,
        reset: resetAvailability,
    } = useMutation({
        mutationFn: checkAvailability,
    })

    function handleRoomTypeChange(value: string) {
        setRoomType(value.toUpperCase())
        setFormError(null)
        resetAvailability()
    }

    function handleDateChange(value: string) {
        setSelectedDate(value)
        setFormError(null)
        resetAvailability()
    }

    function handleAvailabilitySubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const normalizedRoomType = roomType.trim().toUpperCase()

        if (!selectedDate) {
            setFormError('Selecciona una fecha para consultar disponibilidad.')
            return
        }

        if (!normalizedRoomType) {
            setFormError('Ingresa el tipo de habitación.')
            return
        }

        if (selectedDate < getToday()) {
            setFormError('La fecha seleccionada no puede ser anterior a hoy.')
            return
        }

        setFormError(null)

        consultAvailability({
            hotelId: numericHotelId,
            roomType: normalizedRoomType,
            date: selectedDate,
        })
    }

    function scrollToAvailabilityForm() {
        document
            .getElementById('availability-form')
            ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

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

            <div className="relative mt-8 overflow-hidden rounded-3xl bg-linear-to-br from-blue-700 via-blue-600 to-cyan-500 px-8 py-14 text-white shadow-xl md:px-12">
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
                                {hotel.active
                                    ? 'Hotel disponible'
                                    : 'Hotel no disponible'}
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

                    <article
                        id="availability-form"
                        className="scroll-mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
                    >
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
                            Selecciona una fecha e ingresa el tipo de habitación
                            que deseas consultar.
                        </p>

                        <form
                            onSubmit={handleAvailabilitySubmit}
                            className="mt-7 space-y-6"
                        >
                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="reservation-date"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Fecha de alojamiento
                                    </label>

                                    <div className="relative">
                                        <CalendarDays
                                            size={19}
                                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            id="reservation-date"
                                            type="date"
                                            value={selectedDate}
                                            min={getToday()}
                                            onChange={(event) =>
                                                handleDateChange(event.target.value)
                                            }
                                            className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="room-type"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Tipo de habitación
                                    </label>

                                    <div className="relative">
                                        <BedDouble
                                            size={19}
                                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            id="room-type"
                                            type="text"
                                            value={roomType}
                                            onChange={(event) =>
                                                handleRoomTypeChange(
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Ejemplo: SENCILLA"
                                            autoComplete="off"
                                            className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 uppercase text-slate-900 outline-none transition placeholder:normal-case focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                        />
                                    </div>

                                    <p className="mt-2 text-xs text-slate-500">
                                        Debe coincidir con un tipo registrado en el
                                        hotel, por ejemplo SENCILLA.
                                    </p>
                                </div>
                            </div>

                            {formError && (
                                <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
                                    <XCircle
                                        size={20}
                                        className="mt-0.5 shrink-0"
                                    />

                                    <p className="text-sm font-medium">
                                        {formError}
                                    </p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={
                                    isCheckingAvailability || !hotel.active
                                }
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 md:w-auto"
                            >
                                {isCheckingAvailability ? (
                                    <>
                                        <LoaderCircle
                                            size={19}
                                            className="animate-spin"
                                        />
                                        Consultando...
                                    </>
                                ) : (
                                    <>
                                        <Search size={19} />
                                        Consultar habitaciones
                                    </>
                                )}
                            </button>
                        </form>

                        <AvailabilityResult
                            availability={availability}
                            isError={isAvailabilityError}
                            error={availabilityError}
                            hotelId={numericHotelId}
                            roomType={roomType.trim().toUpperCase()}
                            selectedDate={selectedDate}
                        />
                    </article>
                </div>

                <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-7 shadow-sm lg:sticky lg:top-8">
                    <h2 className="text-xl font-bold text-slate-900">
                        Planea tu reservación
                    </h2>

                    <p className="mt-3 leading-7 text-slate-600">
                        Consulta las fechas y habitaciones disponibles antes de
                        crear tu reservación.
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
                                    Las solicitudes se procesan mediante el API
                                    Gateway.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                            <CalendarCheck
                                size={21}
                                className="mt-0.5 shrink-0 text-blue-600"
                            />

                            <div>
                                <p className="font-semibold text-slate-900">
                                    Disponibilidad actualizada
                                </p>

                                <p className="mt-1 text-sm leading-6 text-slate-500">
                                    La información se consulta directamente en
                                    availability-service.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={scrollToAvailabilityForm}
                        disabled={!hotel.active}
                        className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
                    >
                        <Search size={18} />
                        Consultar habitaciones
                    </button>

                    {!hotel.active && (
                        <p className="mt-3 text-center text-sm font-medium text-red-600">
                            Este hotel no se encuentra activo actualmente.
                        </p>
                    )}
                </aside>
            </div>
        </section>
    )
}

interface AvailabilityResultProps {
    availability?: AvailabilityCheckResponse
    isError: boolean
    error: Error | null
    hotelId: number
    roomType: string
    selectedDate: string
}

function AvailabilityResult({
    availability,
    isError,
    error,
    hotelId,
    roomType,
    selectedDate,
}: AvailabilityResultProps) {
    if (isError) {
        return (
            <div className="mt-7 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
                <XCircle size={23} className="mt-0.5 shrink-0" />

                <div>
                    <p className="font-bold">
                        No fue posible consultar la disponibilidad
                    </p>

                    <p className="mt-1 text-sm leading-6">
                        {error instanceof Error
                            ? error.message
                            : 'Ocurrió un error desconocido.'}
                    </p>
                </div>
            </div>
        )
    }

    if (!availability) {
        return null
    }

    if (availability.available) {
        return (
            <div className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                <div className="flex items-start gap-3 text-emerald-700">
                    <CheckCircle2
                        size={25}
                        className="mt-0.5 shrink-0"
                    />

                    <div>
                        <p className="text-lg font-bold">
                            Habitaciones disponibles
                        </p>

                        <p className="mt-1 leading-6">
                            {availability.message}
                        </p>
                    </div>
                </div>

                <div className="mt-5 rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                        Disponibilidad actual
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        {availability.availableRooms}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                        habitaciones disponibles
                    </p>
                </div>

                {availability.availabilityId ? (
                    <Link
                        to={{
                            pathname: '/reservations/new',
                            search: new URLSearchParams({
                                hotelId: String(hotelId),
                                availabilityId: String(
                                    availability.availabilityId,
                                ),
                                roomType,
                                checkInDate: selectedDate,
                                availableRooms: String(
                                    availability.availableRooms,
                                ),
                            }).toString(),
                        }}
                        className="mt-5 flex w-full items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
                    >
                        Continuar con la reservación
                    </Link>
                ) : (
                    <p className="mt-5 rounded-xl bg-amber-100 p-4 text-center text-sm font-medium text-amber-800">
                        No fue posible identificar el registro de disponibilidad.
                    </p>
                )}


            </div>
        )
    }

    return (
        <div className="mt-7 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-800">
            <XCircle size={23} className="mt-0.5 shrink-0" />

            <div>
                <p className="font-bold">
                    No hay habitaciones disponibles
                </p>

                <p className="mt-1 text-sm leading-6">
                    {availability.message}
                </p>

                <p className="mt-2 text-sm">
                    Prueba con otra fecha o con otro tipo de habitación.
                </p>
            </div>
        </div>
    )
}

export default HotelDetailsPage