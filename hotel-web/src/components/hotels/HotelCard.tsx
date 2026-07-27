import {
    Building2,
    ChevronRight,
    MapPin,
    Star,
} from 'lucide-react'
import type { Hotel } from '../../types/hotel'

import { Link } from 'react-router'

interface HotelCardProps {
    hotel: Hotel
}

/**
 * Muestra la información principal de un hotel.
 */
function HotelCard({ hotel }: HotelCardProps) {
    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400">
                <Building2
                    size={72}
                    strokeWidth={1.4}
                    className="text-white/90"
                />

                <span
                    className={[
                        'absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold',
                        hotel.active
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-200 text-slate-600',
                    ].join(' ')}
                >
                    {hotel.active ? 'Disponible' : 'No disponible'}
                </span>
            </div>

            <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-4">
                    <h2 className="text-xl font-bold text-slate-900">
                        {hotel.name}
                    </h2>

                    <div
                        className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-sm font-semibold text-amber-700"
                        aria-label={`${hotel.stars} estrellas`}
                    >
                        <Star
                            size={16}
                            fill="currentColor"
                        />
                        {hotel.stars}
                    </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p className="flex items-start gap-2">
                        <MapPin
                            size={18}
                            className="mt-0.5 shrink-0 text-blue-600"
                        />

                        <span>
                            {hotel.address}, {hotel.city}
                        </span>
                    </p>
                </div>

                <p className="mt-5 line-clamp-3 leading-7 text-slate-600">
                    {hotel.description}
                </p>

                <div className="mt-auto pt-6">
                    {hotel.active ? (
                        <Link
                            to={`/hotels/${hotel.id}`}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Ver disponibilidad
                            <ChevronRight size={19} />
                        </Link>
                    ) : (
                        <button
                            type="button"
                            disabled
                            className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-300 px-5 py-3 font-semibold text-slate-600"
                        >
                            No disponible
                        </button>
                    )}
                </div>
            </div>
        </article>
    )
}

export default HotelCard