import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./shared/components/Navigation.tsx";
import {RegistrationForm} from "./features/auth/RegistrationForm.tsx";
import {LoginForm} from "./features/auth/LoginForm.tsx";
import SeatMap from "./features/booking/seats/SeatMap.tsx";
import {useAppDispatch} from "./appHooks.ts";
import {useEffect} from "react";
import {loginSlice} from "./features/auth/loginSlice.ts";

function App() {
    const eventId = 1;
    const venueId = 1;

    const dispatch = useAppDispatch();
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (accessToken && refreshToken) {
            dispatch(loginSlice.actions.setTokens({ accessToken, refreshToken }));
        }
    }, []);

    return (
        <Router>
            <div className="container" style={{ marginTop: '30px' }}>
                <Navigation />
                <Routes>
                    <Route path="/" element={<RegistrationForm />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/seatmap" element={<SeatMap
                        eventId={eventId}
                        venueId={venueId}/>} />
                </Routes>
            </div>
        </Router>
    );
}


export default App
