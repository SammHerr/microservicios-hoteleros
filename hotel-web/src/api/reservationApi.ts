import apiClient from './axiosClient'

export type ReservationStatus =
    | 'PENDING'
    | 'CONFIRMED'
    | 'CANCELLED'

export interface CreateReservationRequest {
    hotelId: number
    availabilityId: number
    guestName: string
    guestEmail: string
    guestPhone: string
    checkInDate: string
    checkOutDate: string
    numberOfGuests: number
    numberOfRooms: number
    roomType: string
}

export interface ReservationResponse {
    id: number
    hotelId: number
    availabilityId: number
    roomType: string
    guestName: string
    guestEmail: string
    guestPhone: string
    checkInDate: string
    checkOutDate: string
    numberOfGuests: number
    numberOfRooms: number
    status: ReservationStatus
    active: boolean
}

/**
 * Registra una nueva reservación mediante reservation-service.
 */
export async function createReservation(
    reservation: CreateReservationRequest,
): Promise<ReservationResponse> {
    const response = await apiClient.post<ReservationResponse>(
        '/api/reservations',
        reservation,
    )

    return response.data
}

/**
 * Consulta todas las reservaciones registradas.
 */
export async function getReservations(): Promise<ReservationResponse[]> {
    const response = await apiClient.get<ReservationResponse[]>(
        '/api/reservations',
    )

    return response.data
}

/**
 * Actualiza el estado de una reservación.
 */
export async function updateReservationStatus(
    reservationId: number,
    status: ReservationStatus,
): Promise<ReservationResponse> {
    const response = await apiClient.patch<ReservationResponse>(
        `/api/reservations/${reservationId}/status`,
        null,
        {
            params: {
                status,
            },
        },
    )

    return response.data
}

/**
 * Cancela lógicamente una reservación.
 *
 * El backend cambia:
 * status = CANCELLED
 * active = false
 */
export async function cancelReservation(
    reservationId: number,
): Promise<void> {
    await apiClient.delete(`/api/reservations/${reservationId}`)
}

/**
 * Consulta una reservación mediante su identificador.
 */
export async function getReservationById(
    reservationId: number,
): Promise<ReservationResponse> {
    const response = await apiClient.get<ReservationResponse>(
        `/api/reservations/${reservationId}`,
    )

    return response.data
}