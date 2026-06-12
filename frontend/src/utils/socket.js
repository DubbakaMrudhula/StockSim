import { io } from 'socket.io-client';

const SOCKET_URL = 'https://stocksim-n4f1.onrender.com';

export const socket = io(SOCKET_URL, {
  autoConnect: false, // Wait until user is authenticated/components mount
});

// Event listener setup helpers
export const subscribeToStocks = (symbol) => {
  if (symbol) socket.emit('subscribeStock', symbol);
};

export const unsubscribeFromStocks = (symbol) => {
  if (symbol) socket.emit('unsubscribeStock', symbol);
};

export const joinUserRoom = (userId) => {
  if (userId) socket.emit('joinRoom', userId);
};
