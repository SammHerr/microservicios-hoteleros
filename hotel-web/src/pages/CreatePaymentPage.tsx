import { useMutation } from '@tanstack/react-query'
import {
    ArrowLeft,
    BadgeDollarSign,
    Banknote,
    CheckCircle2,
    CreditCard,
    LoaderCircle,
    ReceiptText,
    ShieldCheck,
    XCircle,
} from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router'
import {
    createPayment,
    updatePaymentStatus,
    type CreatePaymentRequest,
    type PaymentResponse,
} from '../api/paymentApi'

function CreatePaymentPage() {
    const [searchParams] = useSearchParams()

    const reservationId = Number(
        searchParams.get('reservationId'),
    )

    const customerEmail =
        searchParams.get('customerEmail')?.trim() ?? ''

    const isValidReservationContext =
        Number.isInteger(reservationId) &&
        reservationId > 0 &&
        customerEmail.length > 0

    const [amount, setAmount] = useState('')
    const [paymentMethod, setPaymentMethod] =
        useState('CARD')

    const [formError, setFormError] =
        useState<string | null>(null)

    const [approvedPayment, setApprovedPayment] =
        useState<PaymentResponse | null>(null)

    const {
        mutate: registerPayment,
        data: createdPayment,
        isPending: isCreatingPayment,
        isError: isCreateError,
        error: createError,
        reset: resetCreatePayment,
    } = useMutation({
        mutationFn: createPayment,
    })

    const {
        mutate: approvePayment,
        isPending: isApprovingPayment,
        isError: isApprovalError,
        error: approvalError,
    } = useMutation({
        mutationFn: (paymentId: number) =>
            updatePaymentStatus(
                paymentId,
                'APPROVED',
            ),

        onSuccess: (payment) => {
            setApprovedPayment(payment)
        },
    })

    function clearPreviousResult() {
        setFormError(null)
        resetCreatePayment()
        setApprovedPayment(null)
    }

    function handleAmountChange(value: string) {
        setAmount(value)
        clearPreviousResult()
    }

    function handlePaymentMethodChange(value: string) {
        setPaymentMethod(value)
        clearPreviousResult()
    }

    function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault()

        const numericAmount = Number(amount)

        if (
            !Number.isFinite(numericAmount) ||
            numericAmount < 0.01
        ) {
            setFormError(
                'El monto debe ser mayor o igual a 0.01.',
            )
            return
        }

        if (!paymentMethod.trim()) {
            setFormError(
                'Selecciona un método de pago.',
            )
            return
        }

        const request: CreatePaymentRequest = {
            reservationId,
            amount: numericAmount,
            paymentMethod:
                paymentMethod.trim().toUpperCase(),
        }

        setFormError(null)
        registerPayment(request)
    }

    if (!isValidReservationContext) {
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
                                Debes ingresar desde una
                                reservación confirmada.
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

    if (approvedPayment) {
        return (
            <section className="mx-auto min-h-[70vh] max-w-4xl px-6 py-16">
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 shadow-sm md:p-12">
                    <CheckCircle2
                        size={58}
                        className="text-emerald-600"
                    />

                    <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-emerald-700">
                        Pago aprobado
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        El pago fue procesado correctamente
                    </h1>

                    <p className="mt-4 leading-7 text-slate-600">
                        El pago de la reservación{' '}
                        <strong>#{approvedPayment.reservationId}</strong>{' '}
                        fue aprobado.
                    </p>

                    <div className="mt-8 grid gap-5 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-2">
                        <PaymentSummaryItem
                            label="Identificador del pago"
                            value={`#${approvedPayment.id}`}
                        />

                        <PaymentSummaryItem
                            label="Reservación"
                            value={`#${approvedPayment.reservationId}`}
                        />

                        <PaymentSummaryItem
                            label="Monto"
                            value={formatCurrency(
                                approvedPayment.amount,
                            )}
                        />

                        <PaymentSummaryItem
                            label="Método"
                            value={
                                approvedPayment.paymentMethod
                            }
                        />

                        <PaymentSummaryItem
                            label="Estado"
                            value={approvedPayment.status}
                        />

                        <PaymentSummaryItem
                            label="Referencia"
                            value={
                                approvedPayment.transactionReference ??
                                'Sin referencia'
                            }
                        />
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link
                            to={{
                                pathname: '/confirmations/new',
                                search: new URLSearchParams({
                                    reservationId: String(
                                        approvedPayment.reservationId,
                                    ),
                                    paymentId: String(approvedPayment.id),
                                    customerEmail,
                                }).toString(),
                            }}
                            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
                        >
                            Generar confirmación
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
                    Procesamiento de pago
                </p>

                <h1 className="mt-2 text-4xl font-bold text-slate-900">
                    Pagar reservación
                </h1>

                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                    Registra el monto y selecciona el método
                    de pago para la reservación.
                </p>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    {!createdPayment ? (
                        <form
                            onSubmit={handleSubmit}
                            className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                    <CreditCard size={24} />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                                        Información del pago
                                    </p>

                                    <h2 className="text-xl font-bold text-slate-900">
                                        Completa la operación
                                    </h2>
                                </div>
                            </div>

                            <div className="mt-8 grid gap-6 md:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="payment-amount"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Monto
                                    </label>

                                    <div className="relative">
                                        <BadgeDollarSign
                                            size={19}
                                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            id="payment-amount"
                                            type="number"
                                            min="0.01"
                                            step="0.01"
                                            value={amount}
                                            required
                                            onChange={(event) =>
                                                handleAmountChange(
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="1500.00"
                                            className="form-input"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="payment-method"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Método de pago
                                    </label>

                                    <div className="relative">
                                        <Banknote
                                            size={19}
                                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <select
                                            id="payment-method"
                                            value={paymentMethod}
                                            onChange={(event) =>
                                                handlePaymentMethodChange(
                                                    event.target.value,
                                                )
                                            }
                                            className="form-input appearance-none"
                                        >
                                            <option value="CARD">
                                                Tarjeta
                                            </option>

                                            <option value="TRANSFER">
                                                Transferencia
                                            </option>

                                            <option value="CASH">
                                                Efectivo
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {formError && (
                                <ErrorMessage
                                    message={formError}
                                    warning
                                />
                            )}

                            {isCreateError && (
                                <ErrorMessage
                                    message={
                                        createError instanceof Error
                                            ? createError.message
                                            : 'No fue posible registrar el pago.'
                                    }
                                />
                            )}

                            <button
                                type="submit"
                                disabled={isCreatingPayment}
                                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
                            >
                                {isCreatingPayment ? (
                                    <>
                                        <LoaderCircle
                                            size={19}
                                            className="animate-spin"
                                        />
                                        Registrando pago...
                                    </>
                                ) : (
                                    <>
                                        <ReceiptText size={19} />
                                        Registrar pago
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 shadow-sm">
                            <div className="flex items-start gap-3">
                                <ReceiptText
                                    size={28}
                                    className="mt-0.5 shrink-0 text-amber-700"
                                />

                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
                                        Pago registrado
                                    </p>

                                    <h2 className="mt-2 text-2xl font-bold text-slate-900">
                                        El pago está pendiente
                                    </h2>

                                    <p className="mt-3 leading-7 text-slate-600">
                                        El pago #{createdPayment.id} fue
                                        registrado y debe aprobarse para
                                        completar la operación.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-4 rounded-2xl bg-white p-6 sm:grid-cols-2">
                                <PaymentSummaryItem
                                    label="Reservación"
                                    value={`#${createdPayment.reservationId}`}
                                />

                                <PaymentSummaryItem
                                    label="Monto"
                                    value={formatCurrency(
                                        createdPayment.amount,
                                    )}
                                />

                                <PaymentSummaryItem
                                    label="Método"
                                    value={
                                        createdPayment.paymentMethod
                                    }
                                />

                                <PaymentSummaryItem
                                    label="Estado"
                                    value={createdPayment.status}
                                />
                            </div>

                            {isApprovalError && (
                                <ErrorMessage
                                    message={
                                        approvalError instanceof Error
                                            ? approvalError.message
                                            : 'No fue posible aprobar el pago.'
                                    }
                                />
                            )}

                            <button
                                type="button"
                                onClick={() =>
                                    approvePayment(
                                        createdPayment.id,
                                    )
                                }
                                disabled={isApprovingPayment}
                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
                            >
                                {isApprovingPayment ? (
                                    <>
                                        <LoaderCircle
                                            size={19}
                                            className="animate-spin"
                                        />
                                        Aprobando pago...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={19} />
                                        Aprobar pago
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-7 shadow-sm lg:sticky lg:top-8">
                    <h2 className="text-xl font-bold text-slate-900">
                        Resumen
                    </h2>

                    <div className="mt-6 rounded-xl bg-slate-50 p-5">
                        <p className="text-sm text-slate-500">
                            Reservación
                        </p>

                        <p className="mt-1 text-2xl font-bold text-slate-900">
                            #{reservationId}
                        </p>
                    </div>

                    <div className="mt-5 flex items-start gap-3 rounded-xl bg-blue-50 p-4 text-blue-700">
                        <ShieldCheck
                            size={21}
                            className="mt-0.5 shrink-0"
                        />

                        <p className="text-sm leading-6">
                            El pago se procesará mediante el
                            API Gateway y payment-service.
                        </p>
                    </div>
                </aside>
            </div>
        </section>
    )
}

interface PaymentSummaryItemProps {
    label: string
    value: string
}

function PaymentSummaryItem({
    label,
    value,
}: PaymentSummaryItemProps) {
    return (
        <div>
            <p className="text-sm font-medium text-slate-500">
                {label}
            </p>

            <p className="mt-1 break-words font-semibold text-slate-900">
                {value}
            </p>
        </div>
    )
}

interface ErrorMessageProps {
    message: string
    warning?: boolean
}

function ErrorMessage({
    message,
    warning = false,
}: ErrorMessageProps) {
    return (
        <div
            className={[
                'mt-6 flex items-start gap-3 rounded-xl border p-4',
                warning
                    ? 'border-amber-200 bg-amber-50 text-amber-800'
                    : 'border-red-200 bg-red-50 text-red-700',
            ].join(' ')}
        >
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

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
    }).format(amount)
}

export default CreatePaymentPage