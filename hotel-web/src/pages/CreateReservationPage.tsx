import { useMutation } from '@tanstack/react-query'
import {
    ArrowLeft,
    BedDouble,
    CalendarDays,
    CheckCircle2,
    Hotel,
    LoaderCircle,
    Mail,
    Phone,
    User,
    Users,
    XCircle,
} from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router'
import {
    createReservation,
    type CreateReservationRequest,
} from '../api/reservationApi'

interface ReservationFormState {
    guestName: string
    guestEmail: string
    guestPhone: string
    checkOutDate: string
    numberOfGuests: string
    numberOfRooms: string
}

function addOneDay(date: string): string {
    if (!date) {
        return ''
    }

    const parsedDate = new Date(`${date}T00:00:00`)
    parsedDate.setDate(parsedDate.getDate() + 1)

    const timezoneOffset = parsedDate.getTimezoneOffset() * 60_000

    return new Date(parsedDate.getTime() - timezoneOffset)
        .toISOString()
        .split('T')[0]
}

function CreateReservationPage() {
    const [searchParams] = useSearchParams()

    const hotelId = Number(searchParams.get('hotelId'))
    const availabilityId = Number(searchParams.get('availabilityId'))
    const roomType = searchParams.get('roomType')?.trim().toUpperCase() ?? ''
    const checkInDate = searchParams.get('checkInDate') ?? ''
    const availableRooms = Number(searchParams.get('availableRooms'))

    const isValidContext =
        Number.isInteger(hotelId) &&
        hotelId > 0 &&
        Number.isInteger(availabilityId) &&
        availabilityId > 0 &&
        roomType.length > 0 &&
        checkInDate.length > 0 &&
        Number.isInteger(availableRooms) &&
        availableRooms > 0

    const [form, setForm] = useState<ReservationFormState>({
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        checkOutDate: addOneDay(checkInDate),
        numberOfGuests: '1',
        numberOfRooms: '1',
    })

    const [formError, setFormError] = useState<string | null>(null)

    const {
        mutate: submitReservation,
        data: createdReservation,
        isPending,
        isError,
        error,
        reset,
    } = useMutation({
        mutationFn: createReservation,
    })

    function updateField(
        field: keyof ReservationFormState,
        value: string,
    ) {
        setForm((currentForm) => ({
            ...currentForm,
            [field]: value,
        }))

        setFormError(null)
        reset()
    }

    function validateForm(): string | null {
        const guestName = form.guestName.trim()
        const guestEmail = form.guestEmail.trim()
        const guestPhone = form.guestPhone.trim()
        const numberOfGuests = Number(form.numberOfGuests)
        const numberOfRooms = Number(form.numberOfRooms)

        if (guestName.length < 3 || guestName.length > 100) {
            return 'El nombre debe tener entre 3 y 100 caracteres.'
        }

        if (!guestEmail) {
            return 'Ingresa el correo electrónico del huésped.'
        }

        if (!guestPhone) {
            return 'Ingresa el teléfono del huésped.'
        }

        if (!form.checkOutDate) {
            return 'Selecciona la fecha de salida.'
        }

        if (form.checkOutDate <= checkInDate) {
            return 'La fecha de salida debe ser posterior a la fecha de entrada.'
        }

        if (!Number.isInteger(numberOfGuests) || numberOfGuests < 1) {
            return 'Debe haber al menos un huésped.'
        }

        if (!Number.isInteger(numberOfRooms) || numberOfRooms < 1) {
            return 'Debes reservar al menos una habitación.'
        }

        if (numberOfRooms > availableRooms) {
            return `Solo hay ${availableRooms} habitaciones disponibles.`
        }

        return null
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const validationError = validateForm()

        if (validationError) {
            setFormError(validationError)
            return
        }

        const request: CreateReservationRequest = {
            hotelId,
            availabilityId,
            guestName: form.guestName.trim(),
            guestEmail: form.guestEmail.trim(),
            guestPhone: form.guestPhone.trim(),
            checkInDate,
            checkOutDate: form.checkOutDate,
            numberOfGuests: Number(form.numberOfGuests),
            numberOfRooms: Number(form.numberOfRooms),
            roomType,
        }

        setFormError(null)
        submitReservation(request)
    }

    if (!isValidContext) {
        return (
            <section className="mx-auto min-h-[70vh] max-w-4xl px-6 py-16">
                <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">
                    <div className="flex items-start gap-3">
                        <XCircle size={25} className="mt-0.5 shrink-0" />

                        <div>
                            <h1 className="text-xl font-bold">
                                Datos de reservación inválidos
                            </h1>

                            <p className="mt-2 leading-7">
                                Primero debes consultar una disponibilidad válida
                                desde la página de un hotel.
                            </p>
                        </div>
                    </div>

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

    if (createdReservation) {
        return (
            <section className="mx-auto min-h-[70vh] max-w-4xl px-6 py-16">
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 shadow-sm md:p-12">
                    <CheckCircle2
                        size={56}
                        className="text-emerald-600"
                    />

                    <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-emerald-700">
                        Reservación registrada
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        Tu reservación fue creada correctamente
                    </h1>

                    <p className="mt-4 leading-7 text-slate-600">
                        La reservación se registró con el identificador{' '}
                        <strong>#{createdReservation.id}</strong>.
                    </p>

                    <div className="mt-8 grid gap-4 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-2">
                        <ReservationSummaryItem
                            label="Huésped"
                            value={createdReservation.guestName}
                        />

                        <ReservationSummaryItem
                            label="Hotel"
                            value={`Hotel #${createdReservation.hotelId}`}
                        />

                        <ReservationSummaryItem
                            label="Entrada"
                            value={createdReservation.checkInDate}
                        />

                        <ReservationSummaryItem
                            label="Salida"
                            value={createdReservation.checkOutDate}
                        />

                        <ReservationSummaryItem
                            label="Habitaciones"
                            value={String(createdReservation.numberOfRooms)}
                        />

                        <ReservationSummaryItem
                            label="Estado"
                            value={createdReservation.status}
                        />
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link
                            to="/reservations"
                            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Ver mis reservaciones
                        </Link>

                        <Link
                            to="/hotels"
                            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Volver a hoteles
                        </Link>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="mx-auto min-h-[70vh] max-w-6xl px-6 py-12">
            <Link
                to={`/hotels/${hotelId}`}
                className="inline-flex items-center gap-2 font-semibold text-blue-600 transition hover:text-blue-700"
            >
                <ArrowLeft size={18} />
                Volver al hotel
            </Link>

            <div className="mt-8">
                <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                    Nueva reservación
                </p>

                <h1 className="mt-2 text-4xl font-bold text-slate-900">
                    Completa tus datos
                </h1>

                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                    Verifica la información de tu estancia y registra los datos
                    del huésped.
                </p>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-3">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-8 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm lg:col-span-2 md:p-9"
                >
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            Información del huésped
                        </h2>

                        <div className="mt-6 grid gap-5 md:grid-cols-2">
                            <FormField
                                id="guest-name"
                                label="Nombre completo"
                                icon={<User size={19} />}
                            >
                                <input
                                    id="guest-name"
                                    type="text"
                                    value={form.guestName}
                                    minLength={3}
                                    maxLength={100}
                                    required
                                    onChange={(event) =>
                                        updateField(
                                            'guestName',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Nombre del huésped"
                                    className="form-input"
                                />
                            </FormField>

                            <FormField
                                id="guest-email"
                                label="Correo electrónico"
                                icon={<Mail size={19} />}
                            >
                                <input
                                    id="guest-email"
                                    type="email"
                                    value={form.guestEmail}
                                    required
                                    onChange={(event) =>
                                        updateField(
                                            'guestEmail',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="correo@ejemplo.com"
                                    className="form-input"
                                />
                            </FormField>

                            <FormField
                                id="guest-phone"
                                label="Teléfono"
                                icon={<Phone size={19} />}
                            >
                                <input
                                    id="guest-phone"
                                    type="tel"
                                    value={form.guestPhone}
                                    required
                                    onChange={(event) =>
                                        updateField(
                                            'guestPhone',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="9620000000"
                                    className="form-input"
                                />
                            </FormField>

                            <FormField
                                id="check-out-date"
                                label="Fecha de salida"
                                icon={<CalendarDays size={19} />}
                            >
                                <input
                                    id="check-out-date"
                                    type="date"
                                    value={form.checkOutDate}
                                    min={addOneDay(checkInDate)}
                                    required
                                    onChange={(event) =>
                                        updateField(
                                            'checkOutDate',
                                            event.target.value,
                                        )
                                    }
                                    className="form-input"
                                />
                            </FormField>
                        </div>
                    </div>

                    <div className="border-t border-slate-200 pt-8">
                        <h2 className="text-xl font-bold text-slate-900">
                            Ocupación
                        </h2>

                        <div className="mt-6 grid gap-5 md:grid-cols-2">
                            <FormField
                                id="number-of-guests"
                                label="Número de huéspedes"
                                icon={<Users size={19} />}
                            >
                                <input
                                    id="number-of-guests"
                                    type="number"
                                    min={1}
                                    step={1}
                                    value={form.numberOfGuests}
                                    required
                                    onChange={(event) =>
                                        updateField(
                                            'numberOfGuests',
                                            event.target.value,
                                        )
                                    }
                                    className="form-input"
                                />
                            </FormField>

                            <FormField
                                id="number-of-rooms"
                                label="Número de habitaciones"
                                icon={<BedDouble size={19} />}
                            >
                                <input
                                    id="number-of-rooms"
                                    type="number"
                                    min={1}
                                    max={availableRooms}
                                    step={1}
                                    value={form.numberOfRooms}
                                    required
                                    onChange={(event) =>
                                        updateField(
                                            'numberOfRooms',
                                            event.target.value,
                                        )
                                    }
                                    className="form-input"
                                />
                            </FormField>
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

                    {isError && (
                        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                            <XCircle
                                size={20}
                                className="mt-0.5 shrink-0"
                            />

                            <div>
                                <p className="font-semibold">
                                    No fue posible crear la reservación
                                </p>

                                <p className="mt-1 text-sm">
                                    {error instanceof Error
                                        ? error.message
                                        : 'Ocurrió un error desconocido.'}
                                </p>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
                    >
                        {isPending ? (
                            <>
                                <LoaderCircle
                                    size={20}
                                    className="animate-spin"
                                />
                                Registrando reservación...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 size={20} />
                                Confirmar reservación
                            </>
                        )}
                    </button>
                </form>

                <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-7 shadow-sm lg:sticky lg:top-8">
                    <h2 className="text-xl font-bold text-slate-900">
                        Resumen de estancia
                    </h2>

                    <div className="mt-6 space-y-4">
                        <SummaryCard
                            icon={<Hotel size={20} />}
                            label="Hotel"
                            value={`Hotel #${hotelId}`}
                        />

                        <SummaryCard
                            icon={<BedDouble size={20} />}
                            label="Tipo de habitación"
                            value={roomType}
                        />

                        <SummaryCard
                            icon={<CalendarDays size={20} />}
                            label="Fecha de entrada"
                            value={checkInDate}
                        />

                        <SummaryCard
                            icon={<BedDouble size={20} />}
                            label="Disponibilidad"
                            value={`${availableRooms} habitaciones`}
                        />
                    </div>

                    <p className="mt-6 rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-700">
                        La disponibilidad será validada nuevamente por
                        reservation-service antes de registrar la operación.
                    </p>
                </aside>
            </div>
        </section>
    )
}

interface FormFieldProps {
    id: string
    label: string
    icon: React.ReactNode
    children: React.ReactNode
}

function FormField({
    id,
    label,
    icon,
    children,
}: FormFieldProps) {
    return (
        <div>
            <label
                htmlFor={id}
                className="mb-2 block text-sm font-semibold text-slate-700"
            >
                {label}
            </label>

            <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {icon}
                </span>

                {children}
            </div>
        </div>
    )
}

interface SummaryCardProps {
    icon: React.ReactNode
    label: string
    value: string
}

function SummaryCard({
    icon,
    label,
    value,
}: SummaryCardProps) {
    return (
        <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
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

interface ReservationSummaryItemProps {
    label: string
    value: string
}

function ReservationSummaryItem({
    label,
    value,
}: ReservationSummaryItemProps) {
    return (
        <div>
            <p className="text-sm font-medium text-slate-500">
                {label}
            </p>

            <p className="mt-1 font-semibold text-slate-900">
                {value}
            </p>
        </div>
    )
}

export default CreateReservationPage