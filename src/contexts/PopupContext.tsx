import React, { createContext, useContext, useState, useCallback } from 'react';

export type PopupType = 'error' | 'success' | 'info';

interface PopupMessage {
    id: number;
    type: PopupType;
    message: string;
}

interface PopupContextType {
    showPopup: (message: string, type?: PopupType) => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

let idCounter = 0;

const bootstrapClass = (type: PopupType): string => {
    switch (type) {
        case 'success': return 'alert-success';
        case 'info': return 'alert-info';
        case 'error': return 'alert-danger'; // ✅ Bootstrap 3.3.7 uses alert-danger
        default: return 'alert-info';
    }
};

export const PopupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<PopupMessage[]>([]);

    const showPopup = useCallback((message: string, type: PopupType = 'info') => {
        const id = ++idCounter;
        setMessages(prev => [...prev, { id, message, type }]);
    }, []);

    const closePopup = useCallback((id: number) => {
        setMessages(prev => prev.filter(msg => msg.id !== id));
    }, []);

    return (
        <PopupContext.Provider value={{ showPopup }}>
            {children}
            {messages.map(({ id, message, type }) => (
                <div
                    key={id}
                    className={`alert ${bootstrapClass(type)} fade in`}
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 9999,
                        minWidth: 300,
                        maxWidth: '80%',
                        textAlign: 'center',
                        paddingRight: 40,
                    }}
                >
                    <button
                        type="button"
                        className="close"
                        onClick={() => closePopup(id)}
                        style={{ position: 'absolute', top: 10, right: 15 }}
                    >
                        &times;
                    </button>
                    {message}
                </div>
            ))}
        </PopupContext.Provider>
    );
};

export const usePopup = (): PopupContextType => {
    const context = useContext(PopupContext);
    if (!context) throw new Error('usePopup must be used within a PopupProvider');
    return context;
};
