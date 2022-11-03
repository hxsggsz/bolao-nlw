import { z } from 'zod'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'
import ShortUniqueId from 'short-unique-id'
import { string } from 'zod/lib'

const client = new PrismaClient({
  log: ['query'],
})

async function bootstrap() {
  const fastify = Fastify({
    logger: true,

  })

  await fastify.register(cors, {
    origin: true,
  })

  fastify.get('/pools/count', async () => {
    const count = await client.pool.count()

    return { count }
  })

  fastify.get('/users/count', async () => {
    const count = await client.user.count()

    return { count }
  })

  fastify.get('/guesses/count', async () => {
    const count = await client.guess.count()

    return { count }
  })

  fastify.post('/pools', async (req, res) => {
    const createPoolBody = z.object({
      title: z.string()
    })

    const { title } = createPoolBody.parse(req.body)

    const generateId = new ShortUniqueId({ length: 6 })
    const code = String(generateId()).toUpperCase()
    await client.pool.create({
      data: {
        title,
        code,
      }
    })

    return res.status(201).send({ code })
  })

  await fastify.listen({ port: 3333 })
}

bootstrap()