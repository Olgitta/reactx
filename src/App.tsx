import ItemList from "./components/ItemList.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import { Page1, Page2 } from "./Pages";

function App() {
    return (
        <Router>
            <div className="container mt-4">
                <Navigation />
                <Routes>
                    <Route path="/" element={<Page1 />} />
                    <Route path="/page2" element={<Page2 />} />
                </Routes>
            </div>
        </Router>
    );
}


export default App
