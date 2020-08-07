export const protocol = 'http';
export const server = 'localhost';
export const port = '3000';

export const serverUrl = `${protocol}://${server}${port !== '80' ? ':' + port : ''}`;
