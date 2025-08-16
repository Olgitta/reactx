import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Navigation from './shared/components/Navigation.tsx';
import {RegistrationForm} from './features/register/RegistrationForm.tsx';
import {LoginForm} from './features/auth/LoginForm.tsx';
import {useAppDispatch} from './appHooks.ts';
import {useEffect} from 'react';
import {loginSlice} from './features/auth/loginSlice.ts';
import Events from './features/booking/events/Events.tsx';
import Seats from './features/booking/seats/Seats.tsx';
import OrderSummary from './features/booking/orders/OrderSummary.tsx';
import Home from './shared/components/Home.tsx';

function App() {

    const dispatch = useAppDispatch();
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (accessToken && refreshToken) {
            dispatch(loginSlice.actions.setTokens({accessToken, refreshToken}));
        }
    }, []);

    return (
        <Router>
            <Navigation/>
            <div className="container">
                <Routes>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/registration" element={<RegistrationForm/>}/>
                    <Route path="/login" element={<LoginForm/>}/>
                    <Route path="/events" element={<Events/>}/>
                    <Route path="/seats" element={<Seats/>}/>
                    <Route path="/order/summary" element={<OrderSummary/>}/>

                    <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
            </div>
        </Router>
    );
}


export default App
