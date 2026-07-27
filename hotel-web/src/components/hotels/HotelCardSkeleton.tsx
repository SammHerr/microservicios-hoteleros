/**
 * Tarjeta provisional mostrada mientras se consultan los hoteles.
 */
function HotelCardSkeleton() {
    return (
        <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="h-48 bg-slate-200" />

            <div className="p-6">
                <div className="h-6 w-3/4 rounded bg-slate-200" />

                <div className="mt-5 h-4 w-full rounded bg-slate-200" />
                <div className="mt-3 h-4 w-2/3 rounded bg-slate-200" />

                <div className="mt-6 h-4 w-full rounded bg-slate-200" />
                <div className="mt-3 h-4 w-full rounded bg-slate-200" />
                <div className="mt-3 h-4 w-4/5 rounded bg-slate-200" />

                <div className="mt-7 h-12 rounded-xl bg-slate-200" />
            </div>
        </div>
    )
}

export default HotelCardSkeleton