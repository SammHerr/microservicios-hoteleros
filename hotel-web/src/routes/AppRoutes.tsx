import { Route, Routes } from 'react-router'
import MainLayout from '../layouts/MainLayout'
import CreateReservationPage from '../pages/CreateReservationPage'
import HomePage from '../pages/HomePage'
import HotelDetailsPage from '../pages/HotelDetailsPage'
import HotelsPage from '../pages/HotelsPage'
import NotFoundPage from '../pages/NotFoundPage'
import ReservationsPage from '../pages/ReservationsPage'
import CreatePaymentPage from '../pages/CreatePaymentPage'
import CreateConfirmationPage from '../pages/CreateConfirmationPage'
import CreateCalendarEntryPage from '../pages/CreateCalendarEntryPage'

function AppRoutes() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route index element={<HomePage />} />

                <Route path="hotels">
                    <Route index element={<HotelsPage />} />
                    <Route
                        path=":hotelId"
                        element={<HotelDetailsPage />}
                    />
                </Route>

                <Route path="reservations">
                    <Route
                        index
                        element={<ReservationsPage />}
                    />

                    <Route
                        path="new"
                        element={<CreateReservationPage />}
                    />
                </Route>

                <Route
                    path="*"
                    element={<NotFoundPage />}
                />
            </Route>

            <Route path="payments">

                <Route
                    path="new"
                    element={<CreatePaymentPage />}
                />
            </Route>

            <Route path="confirmations">
                <Route
                    path="new"
                    element={<CreateConfirmationPage />}
                />
            </Route>

            <Route path="calendar">
                <Route
                    path="new"
                    element={<CreateCalendarEntryPage />}
                />
            </Route>
        </Routes>
    )
}

export default AppRoutes