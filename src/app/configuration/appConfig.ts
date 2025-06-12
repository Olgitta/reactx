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
        }
    };
    ws: {
        url: string;
    }
}

export const appConfig: AppConfig = {
    qweb: {
        api: {
            baseUrl: import.meta.env.VITE_QWEB_API_URL || 'http://localhost:8080/api',
            path: {
                login: import.meta.env.VITE_QWEB_LOGIN_PATH || '/auth/login',
                register: import.meta.env.VITE_QWEB_REGISTER_PATH || '/register',
            }
        },
    },
    booking: {
        api: {
            baseUrl: import.meta.env.VITE_BOOKING_API_URL || 'http://localhost:8081/api',
        },
    },
    ws:{
        url:import.meta.env.VITE_WS_URL || 'http://localhost:3000',
    }
};
