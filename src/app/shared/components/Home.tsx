import React from 'react';

const Home: React.FC = () => {
    return (
        <div className="row">
            <div className="col">
                {/*p-3: Этот класс добавляет одинаковый внутренний отступ (padding) со всех сторон.
                Размер отступа равен 3. Bootstrap имеет шкалу от 0 до 5.*/}

                {/*mb-sm-4: Этот класс добавляет внешний отступ (margin) снизу (b — bottom).
                sm означает, что этот отступ будет применяться только для экранов sm и больше.*/}

                {/*p-lg-5: Этот класс добавляет внутренний отступ (padding) со всех сторон.
                lg означает, что этот отступ будет применяться только для экранов lg и больше.*/}


                <div className="p-3 mb-sm-4 p-lg-5">
                    <div className="page-header">
                        <h2 className="page-title">Event Booking System Demo</h2>
                    </div>
                    <p>
                        This is a modern web-based Event Booking System designed to showcase real-time seat availability,
                        seamless user interactions, and a robust backend architecture. Users can browse events, view
                        available seats in real time, and book tickets efficiently.
                    </p>


                    <h4>Tech Stack & Architecture:</h4>
                    <p>
                        <h5>Frontend</h5> Built with <b>React</b> and <b>TypeScript</b>, powered by <b>Vite</b> for
                        lightning-fast
                        development and optimized builds. The UI is responsive, interactive, and handles real-time updates
                        elegantly.

                    </p>
                    <p>
                        <h5>WebSocket Server</h5> Implemented with <b>NestJS</b>, providing real-time communication for seat
                        availability and booking status, ensuring that multiple users see live updates without page reloads.

                    </p>
                    <p>
                        <h5>Backend API</h5> Developed using <b>Java Spring Boot</b>, handling business logic, booking
                        operations, and exposing REST endpoints for frontend consumption.

                    </p>
                    <p>
                        <h5>Database</h5> <b>PostgreSQL</b>stores events, venues, and booking information with reliability
                        and
                        ACID compliance.

                    </p>
                    <p>
                        <h5>Redis</h5> Used for caching and real-time seat locking/unlocking to prevent double bookings and
                        improve system performance.

                    </p>

                    <p>
                        This demo highlights the seamless integration of a TypeScript frontend, a real-time WebSocket
                        server, and a robust Java backend, all working together to provide a performant and user-friendly
                        event booking experience.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Home