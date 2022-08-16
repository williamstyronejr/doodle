import { useCallback, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import Canvas from './Canvas';

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [input, setInput] = useState('');
  const [doodleId, setDoodleId] = useState<string | null>(null);

  const createRoom = useCallback(() => {
    if (socket) socket.emit('createRoom');
  }, [socket]);

  const joinRoom = useCallback(() => {
    if (socket) socket.emit('joinRoom');
  }, [socket]);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [setSocket]);

  useEffect(() => {
    if (!socket) return;

    const roomCreate = (roomId: string) => {
      setDoodleId(roomId);
    };

    const roomJoin = (success: boolean) => {
      if (success) setDoodleId(input);
    };

    socket.on('roomCreated', roomCreate);
    socket.on('roomJoin', roomJoin);

    return () => {
      socket.off('roomCreated', roomCreate);
      socket.off('roomJoin', roomJoin);
    };
  }, [socket]);

  return (
    <section>
      {doodleId ? (
        <Canvas />
      ) : (
        <div>
          <button onClick={() => createRoom()} type='button'>
            Create Room
          </button>

          <div>
            <input
              type='text'
              value={input}
              onChange={(evt) => setInput(evt.target.value)}
            />

            <button onClick={() => joinRoom()} type='button'>
              Join Room
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default App;
