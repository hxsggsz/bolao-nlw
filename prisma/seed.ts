import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'jhon doe',
      email: 'jhondoe@example.com',
      avatar: 'https://github.com/hxsggsz.png'
    },
  })

  const pool = await prisma.pool.create({
    data: {
      title: 'bolao teste',
      code: 'bol123',
      ownerId: user.id,

      Participant: {
        create: {
          userId: user.id,
        }
      }
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-01T17:32:35.241Z',
      firstTeamCountryCode: 'BR',
      SecondTeamCountryCode: 'DE',
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-02T17:32:35.241Z',
      firstTeamCountryCode: 'US',
      SecondTeamCountryCode: 'JP',

      Guess: {
        create: {
          firstTeamPoints: 2,
          secondTeamPoints: 0,

          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id,
              }
            }
          }
        }
      }
    }
  })
}

main()