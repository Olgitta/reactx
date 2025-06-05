// src/hooks/useWebSocket.ts
import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

// Определяем интерфейс для сообщения Redis, которое приходит через Socket.IO
interface RedisMessage {
    channel: string; // Например, 'seats:lock:event:1'
    pattern: string;
    message: string; // Строка JSON, например, "[1, \"A\", \"2\"]"
}

/**
 * Пользовательский хук для подключения к WebSocket-серверу Socket.IO
 * и обработки входящих сообщений.
 *
 * @param wsUrl URL WebSocket-сервера (например, 'http://localhost:3000').
 * @param channelName
 * @param onMessageCallback Функция обратного вызова, которая будет вызываться при получении сообщения.
 * Должна быть обернута в `useCallback` в компоненте-потребителе для стабильности.
 * @returns Объект со статусом подключения `isConnected` и ссылкой на сам сокет `socket`.
 */
export const useWebSocket = (
    wsUrl: string,
    channelName: string,
    onMessageCallback: (data: RedisMessage) => void // Типизируем входящие данные
    , fetched: React.MutableRefObject<boolean>) => {
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const socketRef = useRef<Socket | null>(null); // Используем useRef для хранения экземпляра сокета

    useEffect(() => {
        if(!fetched.current) {
            return;
        }
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

        // Подписываемся на кастомное событие, которое наш NestJS сервер отправляет
        // Используем переданную функцию обратного вызова для обработки сообщения
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