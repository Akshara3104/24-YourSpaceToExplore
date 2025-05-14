import { io } from 'socket.io-client';

const URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const socket = io(URL);