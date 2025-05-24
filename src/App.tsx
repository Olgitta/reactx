import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import {RegistrationForm} from "./components/auth/RegistrationForm.tsx";
import {LoginForm} from "./components/auth/LoginForm.tsx";
import SeatMap from "./components/SeatMap.tsx";

function App() {
    return (
        <Router>
            <div className="container" style={{ marginTop: '30px' }}>
                <Navigation />
                <Routes>
                    <Route path="/" element={<RegistrationForm />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/seatmap" element={<SeatMap />} />
                </Routes>
            </div>
        </Router>
    );
}


export default App
