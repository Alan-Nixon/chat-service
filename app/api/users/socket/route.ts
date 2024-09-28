// import { Server as HTTPServer } from 'http';
// import { NextApiRequest, NextApiResponse } from 'next';
// import { Server as SocketIOServer } from 'socket.io';

// // Type definition to extend the Next.js response with the Socket.io server
// type NextApiResponseWithSocket = NextApiResponse & {
//   socket: {
//     server: HTTPServer & {
//       io?: SocketIOServer;
//     };
//   };
// };

// export const config = {
//   api: {
//     bodyParser: false, // Disable body parsing for WebSocket compatibility
//   },
// };

//  function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
//   if (!res.socket.server.io) {
//     console.log('Initializing new Socket.io server...');
//     // Create a new Socket.IO server
//     const io = new SocketIOServer(res.socket.server, {
//       path: '/api/socket', // Make sure this path matches frontend
//       cors: {
//         origin: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000', // CORS settings
//         methods: ['GET', 'POST'],
//       },
//     });
//     res.socket.server.io = io;

//     io.on('connection', (socket) => {
//       console.log('A user connected');

//       socket.on('message', (msg: string) => {
//         console.log('Message from client:', msg);
//         socket.broadcast.emit('message', msg);
//       });

//       socket.on('disconnect', () => {
//         console.log('A user disconnected');
//       });
//     });
//   } else {
//     console.log('Socket.io server is already running.');
//   }

//   res.end();
// }


// export default handler as GET