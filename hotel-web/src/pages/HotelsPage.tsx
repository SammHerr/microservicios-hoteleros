import { useQuery } from '@tanstack/react-query'
import { Building2, RefreshCw, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { getHotels } from '../api/hotelApi'
import HotelCard from '../components/hotels/HotelCard'
import HotelCardSkeleton from '../components/hotels/HotelCardSkeleton'

function HotelsPage() {
    const [searchTerm, setSearchTerm] = useState('')

    const {
        data: hotels = [],
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ['hotels'],
        queryFn: getHotels,
    })

    /**
     * Filtra los hoteles por nombre, ciudad o dirección.
     * Por ahora el filtro se realiza localmente.
     */
    const filteredHotels = useMemo(() => {
        const normalizedSearchTerm =
            searchTerm.trim().toLowerCase()

        if (!normalizedSearchTerm) {
            return hotels
        }

        return hotels.filter((hotel) => {
            return (
                hotel.name.toLowerCase().includes(normalizedSearchTerm) ||
                hotel.city.toLowerCase().includes(normalizedSearchTerm) ||
                hotel.address.toLowerCase().includes(normalizedSearchTerm)
            )
        })
    }, [hotels, searchTerm])

    return (
        <section className="mx-auto min-h-[70vh] max-w-7xl px-6 py-16">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                        Catálogo
                    </p>

                    <h1 className="mt-2 text-4xl font-bold text-slate-900">
                        Hoteles disponibles
                    </h1>

                    <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                        Explora los hoteles registrados en la plataforma y encuentra
                        una opción adecuada para tu próxima estancia.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 lg:self-auto"
                >
                    <RefreshCw
                        size={18}
                        className={isFetching ? 'animate-spin' : ''}
                    />

                    Actualizar
                </button>
            </div>

            <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <label
                    htmlFor="hotel-search"
                    className="sr-only"
                >
                    Buscar hoteles
                </label>

                <div className="flex items-center gap-3">
                    <Search
                        size={21}
                        className="shrink-0 text-slate-400"
                    />

                    <input
                        id="hotel-search"
                        type="search"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Buscar por nombre, ciudad o dirección..."
                        className="w-full bg-transparent py-2 text-slate-900 outline-none placeholder:text-slate-400"
                    />
                </div>
            </div>

            {!isLoading && !isError && hotels.length > 0 && (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
                    <p>
                        {filteredHotels.length}{' '}
                        {filteredHotels.length === 1
                            ? 'hotel encontrado'
                            : 'hoteles encontrados'}
                    </p>

                    <p>
                        Total registrado: {hotels.length}
                    </p>
                </div>
            )}

            {isLoading && (
                <div className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <HotelCardSkeleton key={index} />
                    ))}
                </div>
            )}

            {isError && (
                <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">
                    <p className="font-semibold">
                        No fue posible consultar los hoteles.
                    </p>

                    <p className="mt-2 text-sm">
                        {error instanceof Error
                            ? error.message
                            : 'Ocurrió un error desconocido.'}
                    </p>

                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
                    >
                        <RefreshCw size={17} />
                        Reintentar
                    </button>
                </div>
            )}

            {!isLoading && !isError && hotels.length === 0 && (
                <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                        <Building2 size={32} />
                    </div>

                    <h2 className="mt-5 text-xl font-bold text-slate-900">
                        No hay hoteles registrados
                    </h2>

                    <p className="mx-auto mt-2 max-w-lg text-slate-600">
                        Cuando se registren hoteles en la plataforma, aparecerán
                        automáticamente en este catálogo.
                    </p>
                </div>
            )}

            {!isLoading &&
                !isError &&
                hotels.length > 0 &&
                filteredHotels.length === 0 && (
                    <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                        <Search
                            size={42}
                            className="mx-auto text-slate-400"
                        />

                        <h2 className="mt-5 text-xl font-bold text-slate-900">
                            No encontramos coincidencias
                        </h2>

                        <p className="mt-2 text-slate-600">
                            Intenta buscar utilizando otro nombre, ciudad o dirección.
                        </p>

                        <button
                            type="button"
                            onClick={() => setSearchTerm('')}
                            className="mt-5 font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Limpiar búsqueda
                        </button>
                    </div>
                )}

            {!isLoading &&
                !isError &&
                filteredHotels.length > 0 && (
                    <div className="mt-8 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                        {filteredHotels.map((hotel) => (
                            <HotelCard
                                key={hotel.id}
                                hotel={hotel}
                            />
                        ))}
                    </div>
                )}
        </section>
    )
}

export default HotelsPage