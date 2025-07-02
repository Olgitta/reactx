interface AppConfig {
    qweb: {
        api: {
            baseUrl: string;
            path: {
                login: string;
                register: string;
            }
        }
    };
    booking: {
        api: {
            baseUrl: string;
            path: {
                seats: string;
                seatsLocks: string;
                events: string;
            }
        },
    };
    ws: {
        url: string;
        channels: {
            seatsEventsChannelName: string;
            seatsEventsMessagePattern: string;
        }
    }
}

export const appConfig: AppConfig = {
    qweb: {
        api: {
            baseUrl: import.meta.env.VITE_QWEB_API_URL,
            path: {
                login: import.meta.env.VITE_QWEB_LOGIN_PATH,
                register: import.meta.env.VITE_QWEB_REGISTER_PATH,
            }
        },
    },
    booking: {
        api: {
            baseUrl: import.meta.env.VITE_BOOKING_API_URL,
            path: {
                seats: import.meta.env.VITE_BOOKING_SEATS_PATH,
                seatsLocks: import.meta.env.VITE_BOOKING_SEATS_LOCKS_PATH,
                events: import.meta.env.VITE_BOOKING_EVENTS_PATH,
            }
        },
    },
    ws:{
        url:import.meta.env.VITE_WS_URL,
        channels: {
            seatsEventsChannelName: import.meta.env.VITE_WS_SEATS_EVENTS_CHANNEL_NAME,
            seatsEventsMessagePattern: import.meta.env.VITE_WS_SEATS_EVENTS_CHANNEL_MESSAGE_PATTERN,
        }
    }
};
