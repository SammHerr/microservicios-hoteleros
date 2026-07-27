function ReservationsPage() {
    return (
        <section className="mx-auto min-h-[70vh] max-w-7xl px-6 py-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                Administración
            </p>

            <h1 className="mt-2 text-4xl font-bold text-slate-900">
                Mis reservaciones
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-slate-600">
                Aquí se mostrarán las reservaciones registradas en la plataforma.
            </p>

            <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
                Las reservaciones serán conectadas al backend próximamente.
            </div>
        </section>
    )
}

export default ReservationsPage