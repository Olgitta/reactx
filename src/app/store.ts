// Импортируем 'configureStore' из Redux Toolkit.
// Это основная функция для создания Redux-хранилища.
// Она упрощает настройку, автоматически добавляя полезные вещи,
// такие как Redux DevTools, и улучшая стандартные настройки.
import { configureStore } from '@reduxjs/toolkit'

// Импортируем срезы (slices) для управления состоянием в разных частях приложения.
// 'loginSlice' будет отвечать за данные, связанные с входом в систему.
// 'registerSlice' — за данные, связанные с регистрацией.
import {loginSlice} from './features/auth/loginSlice.ts';
import {registerSlice} from './features/register/registerSlice.ts';

import guestReducer from './store/guestSlice.ts';

// Импортируем API-сервисы, созданные с помощью RTK Query.
// 'eventsApi' будет обрабатывать запросы, связанные с событиями.
// 'seatsApi' — с местами.
import {eventsApi} from './features/booking/events/eventsApi.ts';
import {seatsApi} from './features/booking/seats/seatsApi.ts';

// --- Создание Redux-хранилища ---

// Используем 'configureStore' для создания хранилища.
export const store = configureStore({
    // Объект 'reducer' объединяет все редьюсеры в одно целое.
    // Каждый ключ здесь соответствует ключу в общем состоянии приложения.
    reducer: {
        // 'login' и 'register' — это редьюсеры, которые управляют
        // локальным состоянием своих срезов.
        login: loginSlice.reducer,
        register: registerSlice.reducer,
        // Мы используем 'reducerPath', чтобы добавить редьюсеры из RTK Query.
        // Это гарантирует, что имя редьюсера будет уникальным.
        [eventsApi.reducerPath]: eventsApi.reducer,
        [seatsApi.reducerPath]: seatsApi.reducer,

        guest: guestReducer,
    },

    // 'middleware' — это дополнительное ПО, которое может перехватывать действия
    // до того, как они дойдут до редьюсеров. RTK Query использует
    // мидлвэр для обработки асинхронных запросов и кэширования.
    middleware: (getDefaultMiddleware) =>
        // 'getDefaultMiddleware()' возвращает стандартный набор мидлвэров от Redux Toolkit.
        // Затем мы используем '.concat()', чтобы добавить сюда мидлвэры из наших API.
        getDefaultMiddleware().concat(
            eventsApi.middleware,
            seatsApi.middleware),
})

// --- Типизация хранилища для TypeScript ---

// 'RootState' — это тип, который представляет всё состояние хранилища.
// 'ReturnType' автоматически выводит тип из 'store.getState',
// что очень удобно и помогает избежать ошибок.
export type RootState = ReturnType<typeof store.getState>

// 'AppDispatch' — это тип для функции 'dispatch'.
// Он включает в себя все возможные действия, которые можно отправить,
// включая асинхронные действия, обрабатываемые мидлвэром.
export type AppDispatch = typeof store.dispatch