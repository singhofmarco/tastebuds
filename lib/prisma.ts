import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
    .$extends({
      result: {
        recipe: {
          saved: {
            compute() {
              return true
            },
          },
        },
      },
    })
    .$extends({
      result: {
        recipe: {
          isGeneratingImage: {
            compute(recipe) {
              return recipe.qStashMessageId !== null
            },
          },
        },
      },
    })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
