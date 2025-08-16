import {useEffect} from 'react';

export const useUnload = (
    unloadHandler: () => void,) => {

    useEffect(() => {

        window.addEventListener('beforeunload', unloadHandler);

        // Функция, которая вернётся из useEffect, сработает при размонтировании компонента.
        return () => {
            unloadHandler();
            window.removeEventListener('beforeunload', unloadHandler);
        };
    }, [unloadHandler]);
    return;
};