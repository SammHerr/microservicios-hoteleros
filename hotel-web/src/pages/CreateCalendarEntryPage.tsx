import { useMutation, useQuery } from '@tanstack/react-query'
import {
    ArrowLeft,
    BedDouble,
    Building2,
    CalendarCheck,
    CalendarDays,
    CheckCircle2,
    LoaderCircle,
    RefreshCw,
    User,
    XCircle,
} from 'lucide-react'
import { Link, useSearchParams } from 'react-router'
import {
    createCalendarEntry,
    type CreateCalendarEntryRequest,
} from '../api/calendarApi'
import { getReservationById } from '../api/reservationApi'
import type { ReactNode } from 'react'

function CreateCalendarEntryPage() {
    const [searchParams] = useSearchParams()

    const reservationId = Number(
        searchParams.get('reservationId'),
    )

    const confirmationCode =
        searchParams.get('confirmationCode')?.trim() ?? ''

    const isValidReservationId =
        Number.isInteger(reservationId) &&
        reservationId > 0

    const {
        data: reservation,
        isLoading,
        isError: isReservationError,
        error: reservationError,
        refetch,
    } = useQuery({
        queryKey: ['reservation', reservationId],
        queryFn: () =>
            getReservationById(reservationId),
        enabled: isValidReservationId,
    })

    const {
        mutate: addToCalendar,
        data: calendarEntry,
        isPending,
        isError: isCalendarError,
        error: calendarError,
    } = useMutation({
        mutationFn: createCalendarEntry,
    })

    function handleCreateCalendarEntry() {
        if (!reservation) {
            return
        }

        const request: CreateCalendarEntryRequest = {
            hotelId: reservation.hotelId,
            reservationId: reservation.id,
            checkInDate: reservation.checkInDate,
            checkOutDate: reservation.checkOutDate,
            roomType: reservation.roomType,
            status: 'CONFIRMED',
        }

        addToCalendar(request)
    }

    if (!isValidReservationId) {
        return (
            <section className="mx-auto min-h-[70vh] max-w-4xl px-6 py-16">
                <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">
                    <div className="flex items-start gap-3">
                        <XCircle
                            size={25}
                            className="mt-0.5 shrink-0"
                        />

                        <div>
                            <h1 className="text-xl font-bold">
                                Reservación inválida
                            </h1>

                            <p className="mt-2 leading-7">
                                No se encontró un identificador de
                                reservación válido.
                            </p>
                        </div>
                    </div>

                    <Link
                        to="/reservations"
                        className="mt-6 inline-flex items-center gap-2 font-semibold text-blue-600"
                    >
                        <ArrowLeft size={18} />
                        Volver a reservaciones
                    </Link>
                </div>
            </section>
        )
    }

    if (isLoading) {
        return (
            <section className="mx-auto min-h-[70vh] max-w-5xl animate-pulse px-6 py-16">
                <div className="h-5 w-44 rounded bg-slate-200" />
                <div className="mt-5 h-12 w-96 rounded bg-slate-200" />
                <div className="mt-10 h-96 rounded-3xl bg-slate-200" />
            </section>
        )
    }

    if (isReservationError || !reservation) {
        return (
            <section className="mx-auto min-h-[70vh] max-w-4xl px-6 py-16">
                <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">
                    <h1 className="text-xl font-bold">
                        No fue posible consultar la reservación
                    </h1>

                    <p className="mt-2 text-sm">
                        {reservationError instanceof Error
                            ? reservationError.message
                            : 'Ocurrió un error desconocido.'}
                    </p>

                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white"
                    >
                        <RefreshCw size={18} />
                        Reintentar
                    </button>
                </div>
            </section>
        )
    }

    if (
        reservation.status !== 'CONFIRMED' ||
        !reservation.active
    ) {
        return (
            <section className="mx-auto min-h-[70vh] max-w-4xl px-6 py-16">
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-amber-800">
                    <h1 className="text-xl font-bold">
                        Reservación no disponible
                    </h1>

                    <p className="mt-2 leading-7">
                        Solo las reservaciones confirmadas y activas
                        pueden agregarse al calendario.
                    </p>

                    <Link
                        to="/reservations"
                        className="mt-6 inline-flex items-center gap-2 font-semibold text-blue-600"
                    >
                        <ArrowLeft size={18} />
                        Volver a reservaciones
                    </Link>
                </div>
            </section>
        )
    }

    if (calendarEntry) {
        return (
            <section className="mx-auto min-h-[70vh] max-w-4xl px-6 py-16">
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 shadow-sm md:p-12">
                    <CheckCircle2
                        size={58}
                        className="text-emerald-600"
                    />

                    <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-emerald-700">
                        Calendario actualizado
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        La estancia fue agregada al calendario
                    </h1>

                    <p className="mt-4 leading-7 text-slate-600">
                        La reservación #{calendarEntry.reservationId}{' '}
                        quedó registrada en el calendario del hotel.
                    </p>

                    {confirmationCode && (
                        <div className="mt-7 rounded-xl border border-blue-200 bg-blue-50 p-5">
                            <p className="text-sm text-blue-600">
                                Código de confirmación
                            </p>

                            <p className="mt-1 text-xl font-bold text-blue-700">
                                {confirmationCode}
                            </p>
                        </div>
                    )}

                    <div className="mt-7 grid gap-5 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-2">
                        <SummaryItem
                            label="Entrada de calendario"
                            value={`#${calendarEntry.id}`}
                        />

                        <SummaryItem
                            label="Hotel"
                            value={`Hotel #${calendarEntry.hotelId}`}
                        />

                        <SummaryItem
                            label="Fecha de entrada"
                            value={formatDate(
                                calendarEntry.checkInDate,
                            )}
                        />

                        <SummaryItem
                            label="Fecha de salida"
                            value={formatDate(
                                calendarEntry.checkOutDate,
                            )}
                        />

                        <SummaryItem
                            label="Habitación"
                            value={calendarEntry.roomType}
                        />

                        <SummaryItem
                            label="Estado"
                            value={calendarEntry.status}
                        />
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link
                            to="/reservations"
                            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Volver a reservaciones
                        </Link>

                        <Link
                            to="/hotels"
                            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Explorar hoteles
                        </Link>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="mx-auto min-h-[70vh] max-w-5xl px-6 py-12">
            <Link
                to="/reservations"
                className="inline-flex items-center gap-2 font-semibold text-blue-600 transition hover:text-blue-700"
            >
                <ArrowLeft size={18} />
                Volver a reservaciones
            </Link>

            <div className="mt-8">
                <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                    Calendario hotelero
                </p>

                <h1 className="mt-2 text-4xl font-bold text-slate-900">
                    Agregar estancia al calendario
                </h1>

                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                    Verifica la información de la reservación antes
                    de registrar las fechas de estancia.
                </p>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm lg:col-span-2">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                            <CalendarCheck size={24} />
                        </div>

                        <div>
                            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                                Estancia confirmada
                            </p>

                            <h2 className="text-xl font-bold text-slate-900">
                                Reservación #{reservation.id}
                            </h2>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-6 sm:grid-cols-2">
                        <InformationItem
                            icon={<Building2 size={20} />}
                            label="Hotel"
                            value={`Hotel #${reservation.hotelId}`}
                        />

                        <InformationItem
                            icon={<User size={20} />}
                            label="Huésped"
                            value={reservation.guestName}
                        />

                        <InformationItem
                            icon={<CalendarDays size={20} />}
                            label="Fecha de entrada"
                            value={formatDate(
                                reservation.checkInDate,
                            )}
                        />

                        <InformationItem
                            icon={<CalendarDays size={20} />}
                            label="Fecha de salida"
                            value={formatDate(
                                reservation.checkOutDate,
                            )}
                        />

                        <InformationItem
                            icon={<BedDouble size={20} />}
                            label="Tipo de habitación"
                            value={reservation.roomType}
                        />

                        <InformationItem
                            icon={<CheckCircle2 size={20} />}
                            label="Estado"
                            value={reservation.status}
                        />
                    </div>

                    {isCalendarError && (
                        <div className="mt-7 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                            <XCircle
                                size={20}
                                className="mt-0.5 shrink-0"
                            />

                            <p className="text-sm font-medium">
                                {calendarError instanceof Error
                                    ? calendarError.message
                                    : 'No fue posible crear la entrada de calendario.'}
                            </p>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handleCreateCalendarEntry}
                        disabled={isPending}
                        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
                    >
                        {isPending ? (
                            <>
                                <LoaderCircle
                                    size={19}
                                    className="animate-spin"
                                />
                                Agregando al calendario...
                            </>
                        ) : (
                            <>
                                <CalendarCheck size={19} />
                                Agregar al calendario
                            </>
                        )}
                    </button>
                </div>

                <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900">
                        Información
                    </h2>

                    <p className="mt-4 leading-7 text-slate-600">
                        La fecha de salida no se considera como una
                        noche ocupada dentro del calendario.
                    </p>

                    <div className="mt-6 rounded-xl bg-slate-50 p-5">
                        <p className="text-sm text-slate-500">
                            Noches de estancia
                        </p>

                        <p className="mt-1 text-2xl font-bold text-slate-900">
                            {calculateNights(
                                reservation.checkInDate,
                                reservation.checkOutDate,
                            )}
                        </p>
                    </div>
                </aside>
            </div>
        </section>
    )
}

interface InformationItemProps {
    icon: ReactNode
    label: string
    value: string
}

function InformationItem({
    icon,
    label,
    value,
}: InformationItemProps) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 text-blue-600">
                {icon}
            </div>

            <div>
                <p className="text-sm text-slate-500">
                    {label}
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                    {value}
                </p>
            </div>
        </div>
    )
}

interface SummaryItemProps {
    label: string
    value: string
}

function SummaryItem({
    label,
    value,
}: SummaryItemProps) {
    return (
        <div>
            <p className="text-sm text-slate-500">
                {label}
            </p>

            <p className="mt-1 font-semibold text-slate-900">
                {value}
            </p>
        </div>
    )
}

function formatDate(date: string): string {
    return new Intl.DateTimeFormat('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
    }).format(new Date(`${date}T00:00:00Z`))
}

function calculateNights(
    checkInDate: string,
    checkOutDate: string,
): number {
    const checkIn = new Date(`${checkInDate}T00:00:00Z`)
    const checkOut = new Date(`${checkOutDate}T00:00:00Z`)

    return Math.round(
        (checkOut.getTime() - checkIn.getTime()) /
        86_400_000,
    )
}

export default CreateCalendarEntryPage