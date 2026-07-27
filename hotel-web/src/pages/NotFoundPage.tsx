import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'

function NotFoundPage() {
    return (
        <section className="flex min-h-[70vh] items-center justify-center px-6 py-16">
            <div className="text-center">
                <p className="text-7xl font-bold text-blue-600">404</p>

                <h1 className="mt-4 text-3xl font-bold text-slate-900">
                    Página no encontrada
                </h1>

                <p className="mt-3 text-slate-600">
                    La dirección solicitada no existe en la plataforma.
                </p>

                <Link
                    to="/"
                    className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                    <ArrowLeft size={19} />
                    Regresar al inicio
                </Link>
            </div>
        </section>
    )
}

export default NotFoundPage