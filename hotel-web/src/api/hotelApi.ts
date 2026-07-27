import type { Hotel } from '../types/hotel'
import axiosClient from './axiosClient'

/**
 * Obtiene todos los hoteles registrados.
 */
export async function getHotels(): Promise<Hotel[]> {
    const response = await axiosClient.get<Hotel[]>('/api/hotels')

    return response.data
}

/**
 * Obtiene un hotel mediante su identificador.
 */
export async function getHotelById(hotelId: number): Promise<Hotel> {
    const response = await axiosClient.get<Hotel>(
        `/api/hotels/${hotelId}`,
    )

    return response.data
}