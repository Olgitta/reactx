// src/contexts/ConfigContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import {generateIdString} from "../core/utils.ts";

export interface Config {
    guestId: string;
    seatMap: SeatsConfig;
}

interface SeatsConfig {
    apiUrl: string;
    wsUrl: string;
    wsSeatsEventsChannel: string
}

interface ConfigContextType {
    config: Config | null;
    loading: boolean;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState<Config | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // fetch('/config.json')
        //     .then(res => res.json())
        //     .then(data => {
        //         setConfig(data);
        //     })
        //     .catch(err => {
        //         console.error('Failed to load config.json:', err);
        //     })
        //     .finally(() => setLoading(false));

        setConfig({
            guestId: generateIdString(),
            seatMap: {
                apiUrl: "http://localhost:8081",
                wsUrl: "http://localhost:3000",
                wsSeatsEventsChannel: "seat_events"
            }
        });

        setLoading(false);

        console.log("[ConfigProvider] config is loaded")

    }, []);

    return (
        <ConfigContext.Provider value={{ config, loading }}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error('useConfig must be used within a ConfigProvider');
    }
    return context;
};
