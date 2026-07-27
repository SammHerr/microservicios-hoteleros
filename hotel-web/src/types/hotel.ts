/**
 * Representa un hotel recibido desde hotel-service.
 */
export interface Hotel {
    id: number
    name: string
    address: string
    city: string
    stars: number
    description: string
    active: boolean
}