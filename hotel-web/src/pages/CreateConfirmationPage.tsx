import { useMutation } from '@tanstack/react-query'
import {
    ArrowLeft,
    CheckCircle2,
    ClipboardCheck,
    LoaderCircle,
    Mail,
    MessageSquareText,
    ReceiptText,
    XCircle,
} from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router'
import {
    createConfirmation,
    type CreateConfirmationRequest,
} from '../api/confirmationApi'

function CreateConfirmationPage() {
    const [searchParams] = useSearchParams()

    const reservationId = Number(
        searchParams.get('reservationId'),
    )

    const paymentId = Number(
        searchParams.get('paymentId'),
    )

    const initialCustomerEmail =
        searchParams.get('customerEmail')?.trim() ?? ''

    const isValidContext =
        Number.isInteger(reservationId) &&
        reservationId > 0 &&
        Number.isInteger(paymentId) &&
        paymentId > 0 &&
        initialCustomerEmail.length > 0

    const [customerEmail, setCustomerEmail] =
        useState(initialCustomerEmail)

    const [message, setMessage] = useState(
        'Tu reservación y pago fueron confirmados correctamente.',
    )

    const [formError, setFormError] =
        useState<string | null>(null)

    const {
        mutate: submitConfirmation,
        data: confirmation,
        isPending,
        isError,
        error,
    } = useMutation({
        mutationFn: createConfirmation,
    })

    function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault()

        const normalizedEmail = customerEmail.trim()

        if (!normalizedEmail) {
            setFormError(
                'El correo electrónico es obligatorio.',
            )
            return
        }

        const request: CreateConfirmationRequest = {
            reservationId,
            paymentId,
            customerEmail: normalizedEmail,
            message: message.trim(),
        }

        setFormError(null)
        submitConfirmation(request)
    }

    if (!isValidContext) {
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
                                Datos de confirmación inválidos
                            </h1>

                            <p className="mt-2 leading-7">
                                Primero debes completar y aprobar el pago
                                de una reservación.
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

    if (confirmation) {
        return (
            <section className="mx-auto min-h-[70vh] max-w-4xl px-6 py-16">
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 shadow-sm md:p-12">
                    <CheckCircle2
                        size={58}
                        className="text-emerald-600"
                    />

                    <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-emerald-700">
                        Confirmación generada
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        Tu reservación quedó confirmada
                    </h1>

                    <p className="mt-4 leading-7 text-slate-600">
                        Conserva el siguiente código para consultar
                        tu reservación.
                    </p>

                    <div className="mt-8 rounded-2xl bg-white p-7 text-center shadow-sm">
                        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                            Código de confirmación
                        </p>

                        <p className="mt-3 break-all text-3xl font-bold tracking-wider text-blue-600">
                            {confirmation.confirmationCode}
                        </p>
                    </div>

                    <div className="mt-6 grid gap-4 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-2">
                        <SummaryItem
                            label="Confirmación"
                            value={`#${confirmation.id}`}
                        />

                        <SummaryItem
                            label="Reservación"
                            value={`#${confirmation.reservationId}`}
                        />

                        <SummaryItem
                            label="Pago"
                            value={`#${confirmation.paymentId}`}
                        />

                        <SummaryItem
                            label="Estado"
                            value={confirmation.status}
                        />

                        <SummaryItem
                            label="Correo"
                            value={confirmation.customerEmail}
                        />

                        <SummaryItem
                            label="Fecha"
                            value={formatDateTime(
                                confirmation.confirmationDate,
                            )}
                        />
                    </div>

                    {confirmation.message && (
                        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5 text-blue-700">
                            <p className="font-semibold">
                                Mensaje
                            </p>

                            <p className="mt-2 leading-7">
                                {confirmation.message}
                            </p>
                        </div>
                    )}

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                        <Link
                            to={{
                                pathname: '/calendar/new',
                                search: new URLSearchParams({
                                    reservationId: String(
                                        confirmation.reservationId,
                                    ),
                                    confirmationCode:
                                        confirmation.confirmationCode,
                                }).toString(),
                            }}
                            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
                        >
                            Agregar al calendario
                        </Link>
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
                    Confirmación de reservación
                </p>

                <h1 className="mt-2 text-4xl font-bold text-slate-900">
                    Generar confirmación
                </h1>

                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                    Verifica el correo del cliente y genera el código
                    definitivo de confirmación.
                </p>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-3">
                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm lg:col-span-2"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                            <ClipboardCheck size={24} />
                        </div>

                        <div>
                            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                                Datos del cliente
                            </p>

                            <h2 className="text-xl font-bold text-slate-900">
                                Información de confirmación
                            </h2>
                        </div>
                    </div>

                    <div className="mt-8 space-y-6">
                        <div>
                            <label
                                htmlFor="customer-email"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Correo electrónico
                            </label>

                            <div className="relative">
                                <Mail
                                    size={19}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    id="customer-email"
                                    type="email"
                                    value={customerEmail}
                                    required
                                    onChange={(event) => {
                                        setCustomerEmail(
                                            event.target.value,
                                        )
                                        setFormError(null)
                                    }}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="confirmation-message"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Mensaje
                            </label>

                            <div className="relative">
                                <MessageSquareText
                                    size={19}
                                    className="pointer-events-none absolute left-3 top-4 text-slate-400"
                                />

                                <textarea
                                    id="confirmation-message"
                                    value={message}
                                    rows={5}
                                    onChange={(event) =>
                                        setMessage(event.target.value)
                                    }
                                    className="w-full resize-none rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />
                            </div>
                        </div>
                    </div>

                    {formError && (
                        <ErrorMessage message={formError} />
                    )}

                    {isError && (
                        <ErrorMessage
                            message={
                                error instanceof Error
                                    ? error.message
                                    : 'No fue posible generar la confirmación.'
                            }
                        />
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
                    >
                        {isPending ? (
                            <>
                                <LoaderCircle
                                    size={19}
                                    className="animate-spin"
                                />
                                Generando confirmación...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 size={19} />
                                Generar confirmación
                            </>
                        )}
                    </button>
                </form>

                <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900">
                        Resumen
                    </h2>

                    <div className="mt-6 space-y-4">
                        <SummaryCard
                            icon={<ClipboardCheck size={20} />}
                            label="Reservación"
                            value={`#${reservationId}`}
                        />

                        <SummaryCard
                            icon={<ReceiptText size={20} />}
                            label="Pago"
                            value={`#${paymentId}`}
                        />
                    </div>
                </aside>
            </div>
        </section>
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

            <p className="mt-1 break-words font-semibold text-slate-900">
                {value}
            </p>
        </div>
    )
}

interface SummaryCardProps {
    icon: ReactNode
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

interface ErrorMessageProps {
    message: string
}

function ErrorMessage({
    message,
}: ErrorMessageProps) {
    return (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <XCircle
                size={20}
                className="mt-0.5 shrink-0"
            />

            <p className="text-sm font-medium">
                {message}
            </p>
        </div>
    )
}

function formatDateTime(date: string): string {
    return new Intl.DateTimeFormat('es-MX', {
        dateStyle: 'long',
        timeStyle: 'short',
    }).format(new Date(date))
}

export default CreateConfirmationPage