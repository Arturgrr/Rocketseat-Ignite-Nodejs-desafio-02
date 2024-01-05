import { FastifyInstance } from 'fastify'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/users', async (request, reply) => {
    return reply.send({ hello: 'world' })
  })
}
