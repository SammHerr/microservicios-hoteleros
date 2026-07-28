import apiClient from './axiosClient'

export interface CreateCalendarEntryRequest {
    hotelId: number
    reservationId: number
    checkInDate: string
    checkOutDate: string
    roomType: string
    status: string
}

export interface CalendarEntryResponse {
    id: number
    hotelId: number
    reservationId: number
    checkInDate: string
    checkOutDate: string
    roomType: string
    status: string
    active: boolean
}

/**
 * Agrega una reservación confirmada al calendario hotelero.
 */
export async function createCalendarEntry(
    entry: CreateCalendarEntryRequest,
): Promise<CalendarEntryResponse> {
    const response = await apiClient.post<CalendarEntryResponse>(
        '/api/calendar',
        entry,
    )

    return response.data
}