import apiClient from './axiosClient'

export interface AvailabilityCheckParams {
    hotelId: number
    roomType: string
    date: string
}

export interface AvailabilityCheckResponse {
    availabilityId: number | null
    available: boolean
    availableRooms: number
    message: string
}

/**
 * Consulta la disponibilidad para un hotel, tipo de habitación y fecha.
 */
export async function checkAvailability(
    params: AvailabilityCheckParams,
): Promise<AvailabilityCheckResponse> {
    const response = await apiClient.get<AvailabilityCheckResponse>(
        '/api/availability/check',
        {
            params: {
                hotelId: params.hotelId,
                roomType: params.roomType,
                date: params.date,
            },
        },
    )

    return response.data
}