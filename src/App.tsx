import ItemList from "./components/ItemList.tsx";

function App() {
    return (
        <div className="container my-4">
            {/* App Header */}
            <header className="text-center mb-4">
                <h1 className="text-primary">My Todo App</h1>
            </header>

            {/* Main Content */}
            <div className="card shadow">
                <div className="card-body">
                    <ItemList />
                </div>
            </div>
        </div>
    );
}


export default App
