import apiClient from './axiosClient'

export interface CreateConfirmationRequest {
    reservationId: number
    paymentId: number
    customerEmail: string
    message: string
}

export interface ConfirmationResponse {
    id: number
    reservationId: number
    paymentId: number
    confirmationCode: string
    status: string
    confirmationDate: string
    customerEmail: string
    message: string | null
    active: boolean
}

export async function createConfirmation(
    confirmation: CreateConfirmationRequest,
): Promise<ConfirmationResponse> {
    const response = await apiClient.post<ConfirmationResponse>(
        '/api/confirmations',
        confirmation,
    )

    return response.data
}