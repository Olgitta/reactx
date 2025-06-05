import {useRef, useState} from "react";

// const LOCAL_STORAGE_GUEST_ID_KEY = 'guestId';

const generateGuestId = (): string => {
    return 'guest_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const useGuestId = () => {

    const [guestId, setGuestId] = useState<string>('');
    const generated = useRef(false);

    if (!generated.current) {
        generated.current = true;
        setGuestId(generateGuestId());
    }


    // useEffect(() => {
    //     let currentGuestId = localStorage.getItem(LOCAL_STORAGE_GUEST_ID_KEY);
    //     if (!currentGuestId) {
    //         currentGuestId = generateGuestId();
    //         localStorage.setItem(LOCAL_STORAGE_GUEST_ID_KEY, currentGuestId);
    //     }
    //     console.log("[useGuestId]", currentGuestId);
    //     setGuestId(currentGuestId);
    //
    // }, []);

    return guestId;
};