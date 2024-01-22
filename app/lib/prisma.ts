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
.$extends({
	result: {
		recipe: {
			isGeneratingImage: {
				compute(recipe) {
					return recipe.qStashMessageId !== null
				},
			},
		}
	}
})

export default prisma