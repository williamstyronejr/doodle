import path from 'path';
import fastifyStatic from '@fastify/static';
import Fastify from 'fastify';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = Fastify({
  logger: true,
});

server.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
});

server.get('/', async function handler(_, reply) {
  return reply.type('text/html').sendFile('index.html');
});

server.post('/create', async function handler(request, reply) {
  return reply.send({ message: 'create...' });
});

server.post('/join', async function handler(request, reply) {
  return reply.send({ message: 'join...' });
});

async function startServer() {
  try {
    await server.listen({ port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

startServer();
