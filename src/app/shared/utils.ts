export const generateIdString = (): string => {
    return 'REACTX' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const resolvePath = (template: string, params: Record<string, string | number>): string => {
    return template.replace(/{(.*?)}/g, (_, key) => params[key].toString());
}
