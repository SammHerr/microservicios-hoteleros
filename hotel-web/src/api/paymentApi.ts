import apiClient from './axiosClient'

export type PaymentStatus =
    | 'PENDING'
    | 'APPROVED'
    | 'REJECTED'

export interface CreatePaymentRequest {
    reservationId: number
    amount: number
    paymentMethod: string
}

export interface PaymentResponse {
    id: number
    reservationId: number
    amount: number
    paymentMethod: string
    status: PaymentStatus
    transactionReference: string | null
    paymentDate: string
    active: boolean
}

/**
 * Registra un pago nuevo en estado PENDING.
 */
export async function createPayment(
    payment: CreatePaymentRequest,
): Promise<PaymentResponse> {
    const response = await apiClient.post<PaymentResponse>(
        '/api/payments',
        payment,
    )

    return response.data
}

/**
 * Actualiza el estado de un pago.
 */
export async function updatePaymentStatus(
    paymentId: number,
    status: PaymentStatus,
): Promise<PaymentResponse> {
    const response = await apiClient.patch<PaymentResponse>(
        `/api/payments/${paymentId}/status`,
        null,
        {
            params: {
                status,
            },
        },
    )

    return response.data
}