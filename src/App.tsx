import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import {RegistrationForm} from "./components/auth/RegistrationForm.tsx";
import {LoginForm} from "./components/auth/LoginForm.tsx";
import SeatMap from "./components/SeatMap.tsx";

function App() {

    const websocketServerUrl = 'http://localhost:3000'; // Убедись, что это URL твоего NestJS сервера
    const redisChannelEventName = 'redis_message'; // Имя события, которое сервер отправляет для сообщений Redis
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
                        wsUrl={websocketServerUrl}
                        channelName={redisChannelEventName}
                        eventId={eventId}
                        venueId={venueId}/>} />
                </Routes>
            </div>
        </Router>
    );
}


export default App
