import axios from 'axios'

// URL principal del API Gateway obtenida desde el archivo .env.
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

if (!apiBaseUrl) {
    throw new Error(
        'La variable VITE_API_BASE_URL no está configurada en el archivo .env',
    )
}

// Cliente HTTP centralizado para todas las peticiones del frontend.
const axiosClient = axios.create({
    baseURL: apiBaseUrl,
    timeout: 10_000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Interceptor ejecutado antes de enviar cada petición.
axiosClient.interceptors.request.use(
    (config) => {
        // Más adelante el token JWT se almacenará después del inicio de sesión.
        const token = localStorage.getItem('hotel-platform-token')

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

// Interceptor para centralizar errores recibidos desde el backend.
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Posteriormente podremos limpiar la sesión y redirigir al login.
            console.warn('La sesión no está autorizada o ha expirado.')
        }

        return Promise.reject(error)
    },
)

export default axiosClient