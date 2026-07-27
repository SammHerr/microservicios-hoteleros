import { Route, Routes } from 'react-router'
import MainLayout from '../layouts/MainLayout'
import HomePage from '../pages/HomePage'
import HotelDetailsPage from '../pages/HotelDetailsPage'
import HotelsPage from '../pages/HotelsPage'
import NotFoundPage from '../pages/NotFoundPage'
import ReservationsPage from '../pages/ReservationsPage'

function AppRoutes() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route index element={<HomePage />} />

                <Route path="hotels">
                    <Route index element={<HotelsPage />} />
                    <Route path=":hotelId" element={<HotelDetailsPage />} />
                </Route>

                <Route
                    path="reservations"
                    element={<ReservationsPage />}
                />

                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes