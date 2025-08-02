export const generateIdString = (): string => {
    return 'REACTX' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const resolvePath = (template: string, params: Record<string, string | number>): string => {
    return template.replace(/{(.*?)}/g, (_, key) => params[key].toString());
}

export function generateUuid(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    console.warn(
        'crypto.randomUUID() is not available. Falling back to less robust UUID generation. ' +
        'Consider updating your browser or environment if this warning persists in modern setups.'
    );

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
