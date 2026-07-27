import axiosClient from './axiosClient'

// Prueba temporal para verificar la comunicación con el API Gateway.
// La ruta se ajustará cuando confirmemos el endpoint real.
export async function testGatewayConnection(endpoint: string) {
    const response = await axiosClient.get(endpoint)

    return response.data
}