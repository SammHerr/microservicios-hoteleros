import {
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query'
import {
    BedDouble,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Hotel,
    Mail,
    Phone,
    RefreshCw,
    User,
    Users,
    XCircle,
    LoaderCircle,
    ShieldCheck,
    Trash2,
    CreditCard,
} from 'lucide-react'
import { Link } from 'react-router'
import type { ReactNode } from 'react'
import {
    cancelReservation,
    getReservations,
    updateReservationStatus,
    type ReservationResponse,
    type ReservationStatus,
} from '../api/reservationApi'

function ReservationsPage() {
    const queryClient = useQueryClient()
    const {
        data: reservations = [],
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ['reservations'],
        queryFn: getReservations,
    })

    const {
        mutate: confirmReservation,
        isPending: isConfirming,
        variables: confirmingReservationId,
    } = useMutation({
        mutationFn: (reservationId: number) =>
            updateReservationStatus(
                reservationId,
                'CONFIRMED',
            ),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['reservations'],
            })
        },
    })

    const {
        mutate: cancelSelectedReservation,
        isPending: isCancelling,
        variables: cancellingReservationId,
    } = useMutation({
        mutationFn: cancelReservation,

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['reservations'],
            })
        },
    })



    if (isLoading) {
        return <ReservationsSkeleton />
    }

    if (isError) {
        return (
            <section className="mx-auto min-h-[70vh] max-w-7xl px-6 py-16">
                <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                    Administración
                </p>

                <h1 className="mt-2 text-4xl font-bold text-slate-900">
                    Mis reservaciones
                </h1>

                <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">
                    <div className="flex items-start gap-3">
                        <XCircle
                            size={25}
                            className="mt-0.5 shrink-0"
                        />

                        <div>
                            <h2 className="text-lg font-bold">
                                No fue posible consultar las reservaciones
                            </h2>

                            <p className="mt-2 text-sm leading-6">
                                {error instanceof Error
                                    ? error.message
                                    : 'Ocurrió un error desconocido.'}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
                    >
                        <RefreshCw size={18} />
                        Reintentar
                    </button>
                </div>
            </section>
        )
    }

    return (
        <section className="mx-auto min-h-[70vh] max-w-7xl px-6 py-12">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                        Administración
                    </p>

                    <h1 className="mt-2 text-4xl font-bold text-slate-900">
                        Mis reservaciones
                    </h1>

                    <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                        Consulta las reservaciones registradas y revisa su
                        estado actual.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <RefreshCw
                        size={18}
                        className={isFetching ? 'animate-spin' : ''}
                    />

                    {isFetching ? 'Actualizando...' : 'Actualizar'}
                </button>
            </div>

            <div className="mt-8 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
                <div>
                    <p className="text-sm text-slate-500">
                        Reservaciones registradas
                    </p>

                    <p className="mt-1 text-2xl font-bold text-slate-900">
                        {reservations.length}
                    </p>
                </div>

                <CalendarDays
                    size={34}
                    className="text-blue-600"
                />
            </div>

            {reservations.length === 0 ? (
                <EmptyReservations />
            ) : (
                <div className="mt-8 grid gap-6 xl:grid-cols-2">
                    {reservations.map((reservation) => (
                        <ReservationCard
                            key={reservation.id}
                            reservation={reservation}
                            isConfirming={
                                isConfirming &&
                                confirmingReservationId === reservation.id
                            }
                            isCancelling={
                                isCancelling &&
                                cancellingReservationId === reservation.id
                            }
                            onConfirm={() =>
                                confirmReservation(reservation.id)
                            }
                            onCancel={() => {
                                const confirmed = window.confirm(
                                    `¿Deseas cancelar la reservación #${reservation.id}?`,
                                )

                                if (confirmed) {
                                    cancelSelectedReservation(reservation.id)
                                }
                            }}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}

interface ReservationCardProps {
    reservation: ReservationResponse
    isConfirming: boolean
    isCancelling: boolean
    onConfirm: () => void
    onCancel: () => void
}

function ReservationCard({
    reservation,
    isConfirming,
    isCancelling,
    onConfirm,
    onCancel,
}: ReservationCardProps) {
    return (
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        Reservación
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                        #{reservation.id}
                    </h2>
                </div>

                <ReservationStatusBadge
                    status={reservation.status}
                />
            </div>

            <div className="p-6">
                <div className="grid gap-5 sm:grid-cols-2">
                    <ReservationInformation
                        icon={<BedDouble size={19} />}
                        label="Tipo de habitación"
                        value={reservation.roomType}
                    />

                    <ReservationInformation
                        icon={<Hotel size={19} />}
                        label="Hotel"
                        value={`Hotel #${reservation.hotelId}`}
                    />

                    <ReservationInformation
                        icon={<CalendarDays size={19} />}
                        label="Fecha de entrada"
                        value={formatDate(reservation.checkInDate)}
                    />

                    <ReservationInformation
                        icon={<CalendarDays size={19} />}
                        label="Fecha de salida"
                        value={formatDate(reservation.checkOutDate)}
                    />

                    <ReservationInformation
                        icon={<Users size={19} />}
                        label="Huéspedes"
                        value={String(reservation.numberOfGuests)}
                    />

                    <ReservationInformation
                        icon={<BedDouble size={19} />}
                        label="Habitaciones"
                        value={String(reservation.numberOfRooms)}
                    />
                </div>

                <div className="mt-6 border-t border-slate-200 pt-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <ReservationInformation
                            icon={<Mail size={19} />}
                            label="Correo"
                            value={reservation.guestEmail}
                        />

                        <ReservationInformation
                            icon={<Phone size={19} />}
                            label="Teléfono"
                            value={reservation.guestPhone}
                        />
                    </div>
                </div>

                {reservation.status !== 'CANCELLED' &&
                    reservation.active && (
                        <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row">
                            {reservation.status === 'PENDING' && (
                                <button
                                    type="button"
                                    onClick={onConfirm}
                                    disabled={
                                        isConfirming ||
                                        isCancelling
                                    }
                                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
                                >
                                    {isConfirming ? (
                                        <>
                                            <LoaderCircle
                                                size={18}
                                                className="animate-spin"
                                            />
                                            Confirmando...
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck size={18} />
                                            Confirmar reservación
                                        </>
                                    )}
                                </button>
                            )}

                            {reservation.status === 'CONFIRMED' && (
                                <Link
                                    to={{
                                        pathname: '/payments/new',
                                        search: new URLSearchParams({
                                            reservationId: String(reservation.id),
                                            customerEmail: reservation.guestEmail,
                                        }).toString(),
                                    }}
                                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                                >
                                    <CreditCard size={18} />
                                    Proceder al pago
                                </Link>
                            )}
                            <button
                                type="button"
                                onClick={onCancel}
                                disabled={
                                    isConfirming ||
                                    isCancelling
                                }
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-300 bg-white px-5 py-3 font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-100 disabled:text-slate-400"
                            >
                                {isCancelling ? (
                                    <>
                                        <LoaderCircle
                                            size={18}
                                            className="animate-spin"
                                        />
                                        Cancelando...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={18} />
                                        Cancelar reservación
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                {!reservation.active && (
                    <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                        <XCircle
                            size={20}
                            className="mt-0.5 shrink-0"
                        />

                        <p className="text-sm font-medium">
                            Esta reservación se encuentra inactiva.
                        </p>
                    </div>
                )}
            </div>
        </article>
    )
}

interface ReservationStatusBadgeProps {
    status: ReservationStatus
}

function ReservationStatusBadge({
    status,
}: ReservationStatusBadgeProps) {
    const statusConfiguration = {
        PENDING: {
            label: 'Pendiente',
            icon: <Clock3 size={16} />,
            classes:
                'border-amber-200 bg-amber-100 text-amber-700',
        },
        CONFIRMED: {
            label: 'Confirmada',
            icon: <CheckCircle2 size={16} />,
            classes:
                'border-emerald-200 bg-emerald-100 text-emerald-700',
        },
        CANCELLED: {
            label: 'Cancelada',
            icon: <XCircle size={16} />,
            classes:
                'border-red-200 bg-red-100 text-red-700',
        },
    } satisfies Record<
        ReservationStatus,
        {
            label: string
            icon: ReactNode
            classes: string
        }
    >

    const configuration = statusConfiguration[status]

    return (
        <span
            className={[
                'inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold',
                configuration.classes,
            ].join(' ')}
        >
            {configuration.icon}
            {configuration.label}
        </span>
    )
}

interface ReservationInformationProps {
    icon: ReactNode
    label: string
    value: string
}

function ReservationInformation({
    icon,
    label,
    value,
}: ReservationInformationProps) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 text-blue-600">
                {icon}
            </div>

            <div className="min-w-0">
                <p className="text-sm text-slate-500">
                    {label}
                </p>

                <p className="mt-1 break-words font-semibold text-slate-900">
                    {value}
                </p>
            </div>
        </div>
    )
}

function EmptyReservations() {
    return (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <CalendarDays
                size={48}
                className="mx-auto text-blue-600"
            />

            <h2 className="mt-5 text-xl font-bold text-slate-900">
                No hay reservaciones registradas
            </h2>

            <p className="mx-auto mt-3 max-w-lg leading-7 text-slate-500">
                Consulta la disponibilidad de un hotel y crea tu primera
                reservación.
            </p>

            <Link
                to="/hotels"
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
                Explorar hoteles
            </Link>
        </div>
    )
}

function ReservationsSkeleton() {
    return (
        <section className="mx-auto min-h-[70vh] max-w-7xl animate-pulse px-6 py-12">
            <div className="h-4 w-36 rounded bg-slate-200" />
            <div className="mt-4 h-10 w-72 rounded bg-slate-200" />
            <div className="mt-4 h-6 w-full max-w-xl rounded bg-slate-200" />

            <div className="mt-8 h-24 rounded-2xl bg-slate-200" />

            <div className="mt-8 grid gap-6 xl:grid-cols-2">
                <div className="h-96 rounded-2xl bg-slate-200" />
                <div className="h-96 rounded-2xl bg-slate-200" />
            </div>
        </section>
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

export default ReservationsPage