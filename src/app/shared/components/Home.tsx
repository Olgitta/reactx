import React from 'react';

const Home: React.FC = () => {
    return (
        <div className="row">
            <div className="col">
                <div className="page-header">
                    <h2 className="page-title">Event Booking System Demo</h2>
                </div>
                <p>
                    This is a modern web-based Event Booking System designed to showcase real-time seat availability,
                    seamless user interactions, and a robust backend architecture. Users can browse events, view
                    available seats in real time, and book tickets efficiently.
                </p>


                <h2>Tech Stack & Architecture:</h2>
                <p>
                    <h3>Frontend</h3> Built with <b>React</b> and <b>TypeScript</b>, powered by <b>Vite</b> for lightning-fast
                    development and optimized builds. The UI is responsive, interactive, and handles real-time updates
                    elegantly.

                </p>
                <p>
                    <h3>WebSocket Server</h3> Implemented with <b>NestJS</b>, providing real-time communication for seat
                    availability and booking status, ensuring that multiple users see live updates without page reloads.

                </p>
                <p>
                    <h3>Backend API</h3> Developed using <b>Java Spring Boot</b>, handling business logic, booking
                    operations, and exposing REST endpoints for frontend consumption.

                </p>
                <p>
                    <h3>Database</h3><b>PostgreSQL</b>stores events, venues, and booking information with reliability and
                    ACID compliance.

                </p>
                <p>
                    <h3>Redis</h3> Used for caching and real-time seat locking/unlocking to prevent double bookings and
                    improve system performance.

                </p>

                <p>
                    This demo highlights the seamless integration of a TypeScript frontend, a real-time WebSocket
                    server, and a robust Java backend, all working together to provide a performant and user-friendly
                    event booking experience.
                </p>
            </div>
        </div>
    )
}

export default Home