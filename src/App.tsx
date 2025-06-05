import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import {RegistrationForm} from "./components/auth/RegistrationForm.tsx";
import {LoginForm} from "./components/auth/LoginForm.tsx";
import SeatMap from "./components/seats/SeatMap.tsx";
// import {useConfig} from "./contexts/ConfigContext.tsx";

function App() {

    // const config = useConfig();

    const eventId = 1;
    const venueId = 1;

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
