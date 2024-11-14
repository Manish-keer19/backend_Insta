import { Server, Socket } from 'socket.io';

export const initializeCallerSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {  // Fix: Corrected parentheses around socket parameter
    console.log('A user connected: ', socket.id);

    // Listen for the offer from the client
    socket.on('offer', (offer) => {
      console.log('Offer received: ', offer);
      socket.broadcast.emit('offer', offer);  // Send offer to other peer
    });

    // Listen for the answer from the client
    socket.on('answer', (answer) => {
      console.log('Answer received: ', answer);
      socket.broadcast.emit('answer', answer);  // Send answer to other peer
    });

    // Listen for ICE candidates from the client
    socket.on('candidate', (candidate) => {
      console.log('Candidate received: ', candidate);
      socket.broadcast.emit('candidate', candidate);  // Send candidate to other peer
    });

    // Handle socket disconnection
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};
