export const generateIdString = (): string => {
    return 'REACTX' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};