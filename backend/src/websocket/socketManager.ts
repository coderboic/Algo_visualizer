import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';

interface VisualizationRoom {
  id: string;
  algorithm: string;
  participants: Map<string, { userId: string; username: string }>;
  currentStep: number;
  isPlaying: boolean;
}

class SocketManager {
  private io: SocketIOServer | null = null;
  private rooms: Map<string, VisualizationRoom> = new Map();

  initialize(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.setupEventHandlers();
    console.log('🔌 WebSocket server initialized');
  }

  private setupEventHandlers() {
    if (!this.io) return;

    this.io.on('connection', (socket: Socket) => {
      console.log(`👤 User connected: ${socket.id}`);

      // Join visualization room
      socket.on('join-room', (data: { roomId: string; userId: string; username: string }) => {
        const { roomId, userId, username } = data;
        socket.join(roomId);

        // Create or update room
        if (!this.rooms.has(roomId)) {
          this.rooms.set(roomId, {
            id: roomId,
            algorithm: '',
            participants: new Map(),
            currentStep: 0,
            isPlaying: false,
          });
        }

        const room = this.rooms.get(roomId)!;
        room.participants.set(socket.id, { userId, username });

        // Notify others in the room
        socket.to(roomId).emit('user-joined', {
          userId,
          username,
          participantCount: room.participants.size,
        });

        // Send current room state to the new user
        socket.emit('room-state', {
          algorithm: room.algorithm,
          currentStep: room.currentStep,
          isPlaying: room.isPlaying,
          participants: Array.from(room.participants.values()),
        });
      });

      // Leave room
      socket.on('leave-room', (roomId: string) => {
        this.handleLeaveRoom(socket, roomId);
      });

      // Visualization controls
      socket.on('visualization-play', (data: { roomId: string }) => {
        const room = this.rooms.get(data.roomId);
        if (room) {
          room.isPlaying = true;
          this.io?.to(data.roomId).emit('visualization-state-change', {
            isPlaying: true,
            currentStep: room.currentStep,
          });
        }
      });

      socket.on('visualization-pause', (data: { roomId: string }) => {
        const room = this.rooms.get(data.roomId);
        if (room) {
          room.isPlaying = false;
          this.io?.to(data.roomId).emit('visualization-state-change', {
            isPlaying: false,
            currentStep: room.currentStep,
          });
        }
      });

      socket.on('visualization-step', (data: { roomId: string; step: number }) => {
        const room = this.rooms.get(data.roomId);
        if (room) {
          room.currentStep = data.step;
          socket.to(data.roomId).emit('visualization-step-change', {
            step: data.step,
          });
        }
      });

      socket.on('visualization-reset', (data: { roomId: string }) => {
        const room = this.rooms.get(data.roomId);
        if (room) {
          room.currentStep = 0;
          room.isPlaying = false;
          this.io?.to(data.roomId).emit('visualization-state-change', {
            isPlaying: false,
            currentStep: 0,
          });
        }
      });

      // Code execution
      socket.on('code-execute', (data: { roomId: string; code: string; input: any }) => {
        // Broadcast to others in the room
        socket.to(data.roomId).emit('code-execution-started', {
          userId: socket.id,
          code: data.code,
        });
      });

      socket.on('code-result', (data: { roomId: string; result: any; error?: string }) => {
        // Broadcast execution result to room
        this.io?.to(data.roomId).emit('code-execution-result', {
          userId: socket.id,
          result: data.result,
          error: data.error,
        });
      });

      // Chat messages
      socket.on('chat-message', (data: { roomId: string; message: string; username: string }) => {
        this.io?.to(data.roomId).emit('chat-message', {
          userId: socket.id,
          username: data.username,
          message: data.message,
          timestamp: new Date().toISOString(),
        });
      });

      // Cursor tracking for collaborative editing
      socket.on('cursor-position', (data: { roomId: string; position: any }) => {
        socket.to(data.roomId).emit('cursor-update', {
          userId: socket.id,
          position: data.position,
        });
      });

      // Code changes for collaborative editing
      socket.on('code-change', (data: { roomId: string; code: string; changes: any }) => {
        socket.to(data.roomId).emit('code-update', {
          userId: socket.id,
          code: data.code,
          changes: data.changes,
        });
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`👤 User disconnected: ${socket.id}`);
        // Clean up from all rooms
        this.rooms.forEach((room, roomId) => {
          if (room.participants.has(socket.id)) {
            this.handleLeaveRoom(socket, roomId);
          }
        });
      });
    });
  }

  private handleLeaveRoom(socket: Socket, roomId: string) {
    const room = this.rooms.get(roomId);
    if (room && room.participants.has(socket.id)) {
      const user = room.participants.get(socket.id);
      room.participants.delete(socket.id);
      
      socket.leave(roomId);
      socket.to(roomId).emit('user-left', {
        userId: user?.userId,
        username: user?.username,
        participantCount: room.participants.size,
      });

      // Clean up empty rooms
      if (room.participants.size === 0) {
        this.rooms.delete(roomId);
      }
    }
  }

  // Method to emit visualization steps from the server
  emitVisualizationStep(roomId: string, step: any) {
    this.io?.to(roomId).emit('visualization-step', step);
  }

  // Method to broadcast algorithm execution progress
  broadcastExecutionProgress(roomId: string, progress: any) {
    this.io?.to(roomId).emit('execution-progress', progress);
  }

  getIO(): SocketIOServer | null {
    return this.io;
  }
}

export default new SocketManager();