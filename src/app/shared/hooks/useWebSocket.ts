import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import {RedisMessage} from './types.ts';

/**
 *
 * @param wsUrl
 * @param channelName
 * @param onMessageCallback
 */
export const useWebSocket = (
    wsUrl: string,
    channelName: string,
    onMessageCallback: (data: RedisMessage) => void) => {

    const [isConnected, setIsConnected] = useState<boolean>(false);
    const socketRef = useRef<Socket | null>(null); // Используем useRef для хранения экземпляра сокета

    useEffect(() => {

        console.log(`[useWebSocket] Attempting to connect to WebSocket at ${wsUrl}`);
        // Создаем новый экземпляр сокета
        const newSocket: Socket = io(wsUrl);
        socketRef.current = newSocket; // Сохраняем его в рефе

        // Обработчики событий Socket.IO
        newSocket.on('connect', () => {
            console.log('[useWebSocket] Connected to WebSocket server!');
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('[useWebSocket] Disconnected from WebSocket server.');
            setIsConnected(false);
        });

        newSocket.on('connect_error', (error: Error) => {
            console.error('[useWebSocket] WebSocket connection error:', error.message);
            setIsConnected(false);
        });

        console.log(`[useWebSocket] subscribing to channel: ${channelName}`);
        newSocket.on(channelName, onMessageCallback);

        // Функция очистки: выполняется при размонтировании компонента или изменении зависимостей
        return () => {
            console.log('[useWebSocket] Disconnecting from WebSocket server...');
            newSocket.off(channelName, onMessageCallback); // Отписываемся от события
            newSocket.disconnect(); // Закрываем соединение
        };
    }, [wsUrl, channelName, onMessageCallback]); // Зависимости хука:
    // wsUrl: если изменится URL сервера, соединение будет переустановлено.
    // eventName: если изменится имя события, подписка будет переустановлена.
    // onMessageCallback: крайне важно, чтобы эта функция была стабильной (обернута в useCallback в компоненте-потребителе).

    return { isConnected, socket: socketRef.current };
};