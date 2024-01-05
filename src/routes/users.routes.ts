import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (req, rep) => {
    const creteUserBody = z.object({
      name: z.string(),
      email: z.string().email(),
    })

    let sessionId = req.cookies.session_id

    if (!sessionId) {
      sessionId = randomUUID()

      rep.setCookie('session_id', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    const { name, email } = creteUserBody.parse(req.body)

    const userByEmail = await knex('users').where({ email }).first()

    if (userByEmail) {
      return rep.status(400).send({ message: 'User already exists' })
    }

    await knex('users').insert({
      session_id: sessionId,
      name,
      email,
    })

    return rep.status(200).send()
  })
}
