import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient().$extends({
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

export default prisma