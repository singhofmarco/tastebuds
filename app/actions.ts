'use server'

import { OpenAiRecipe } from '@/types'
import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'
import {
  S3Client,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
} from '@aws-sdk/client-s3'
import { Client as QstashClient } from '@upstash/qstash'
import { lucia, validateRequest } from '@/auth'
import { z } from 'zod'
import { Argon2id } from 'oslo/password'
import { cookies } from 'next/headers'
import { generateId } from 'lucia'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  region: process.env.AWS_REGION,
})

const prisma = new PrismaClient()

export async function save(recipe: OpenAiRecipe, shouldGenerateImage: boolean) {
  const { user } = await checkIfUserAuthenticated()

  const {
    title,
    description,
    image,
    ingredients,
    steps,
    totalTime,
    cuisineType,
  } = recipe

  const storedRecipe = await prisma.recipe.create({
    data: {
      title,
      description,
      steps,
      ingredients,
      totalTime,
      cuisineType,
      image,
      userId: user.id,
    },
  })

  revalidatePath('/recipes')

  if (shouldGenerateImage) {
    await generateImage(storedRecipe.id, title)
  }

  redirect('/recipes/' + storedRecipe.id)
}

export async function generateImage(recipeId: number, title: string) {
  const DALL_E = 'https://api.openai.com/v1/images/generations'

  if (!process.env.QSTASH_TOKEN) {
    throw new Error('Qstash token is not set')
  }

  const client = new QstashClient({ token: process.env.QSTASH_TOKEN })
  const res = await client
    .publishJSON({
      url: DALL_E,
      body: {
        model: 'dall-e-3',
        prompt: 'Create a realistic image of: ' + title,
        n: 1,
        size: '1024x1024',
        response_format: 'url',
      },
      headers: {
        'Content-Type': 'application/json',
        'Upstash-Forward-Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      callback: `${process.env.NODE_ENV !== 'production' ? process.env.CALLBACK_BASE_URL : 'https://' + process.env.VERCEL_URL}/api/recipes/image/callback`,
      method: 'POST',
    })
    .catch((error) => {
      throw new Error('Failed to generate image', error)
    })

  await prisma.recipe.update({
    where: {
      id: recipeId,
    },
    data: {
      qStashMessageId: res.messageId,
    },
  })

  revalidatePath(`/recipes/${recipeId}`)
}

// delete recipe from database
export async function deleteRecipe(recipeId: number) {
  const { user } = await checkIfUserAuthenticated()

  const recipe = await prisma.recipe.findUnique({
    where: {
      id: recipeId,
    },
  })

  if (!recipe) {
    return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
  }

  // check if recipe belongs to user
  if (recipe.userId !== user.id) {
    return NextResponse.json(
      { error: 'You are not authorized to delete this recipe' },
      { status: 401 }
    )
  }

  if (!process.env.AWS_BUCKET_NAME || !process.env.AWS_REGION) {
    throw new Error('AWS bucket config is not set')
  }

  // delete image from S3 bucket
  try {
    if (recipe.image) {
      const params: DeleteObjectCommandInput = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: recipe.image.split('/').pop(),
      }

      await s3Client.send(new DeleteObjectCommand(params))
    }
  } catch (error) {
    console.log('Failed to delete image', error)
  }

  // delete recipe from database
  try {
    await prisma.recipe.delete({
      where: {
        id: recipe.id,
      },
    })
  } catch (error) {
    throw new Error('Failed to delete recipe')
  }

  revalidatePath('/recipes')

  return redirect('/recipes')
}

const signInSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Invalid email address',
    })
    .email({ message: 'Invalid email address' }),
  password: z.string({
    invalid_type_error: 'Invalid password',
  }),
})

export async function signIn(
  prevState: any,
  formData: FormData
): Promise<{
  errors: { email?: string[] | undefined; password?: string[] | undefined }
}> {
  const validatedFields = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const existingUser = await prisma?.user.findUnique({
    where: {
      email: validatedFields.data.email.toLowerCase(),
    },
  })

  if (!existingUser) {
    return {
      errors: {
        password: ['Incorrect email or password'],
      },
    }
  }

  const validPassword = await new Argon2id().verify(
    existingUser.hashedPassword,
    validatedFields.data.password
  )
  if (!validPassword) {
    return {
      errors: {
        password: ['Incorrect email or password'],
      },
    }
  }

  const session = await lucia.createSession(existingUser.id, {})
  const sessionCookie = lucia.createSessionCookie(session.id)
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  )
  return redirect('/')
}

const UNIQUE_CONSTRAINT_ERROR_CODE = 'P2002'

const signUpSchema = z.object({
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Invalid name',
  }),
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Invalid email address',
    })
    .email({ message: 'Invalid email address' }),
  password: z.string({
    invalid_type_error: 'Invalid password',
  }),
})

export async function signUp(
  prevState: any,
  formData: FormData
): Promise<{
  errors: {
    name?: string[] | undefined
    email?: string[] | undefined
    password?: string[] | undefined
  }
}> {
  const validatedFields = signUpSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const hashedPassword = await new Argon2id().hash(
    validatedFields.data.password
  )
  const userId = generateId(15)

  try {
    await prisma?.user.create({
      data: {
        id: userId,
        email: validatedFields.data.email,
        name: validatedFields.data.name,
        hashedPassword: hashedPassword,
      },
    })

    const session = await lucia.createSession(userId, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    )
    return redirect('/')
  } catch (e) {
    // If the error thrown from Prisma Client is a Unique Constraint Error,
    // this means that an existing user already has the same email address
    if (
      e instanceof PrismaClientKnownRequestError &&
      e.code === UNIQUE_CONSTRAINT_ERROR_CODE &&
      (e.meta?.target as string[]).includes('email')
    ) {
      return {
        errors: {
          email: ['Email is already taken'],
        },
      }
    }
    console.log(e)
    return {
      errors: {
        email: ['Something went wrong'],
      },
    }
  }
}

export async function signOut(): Promise<{ error: string }> {
  const { session } = await checkIfUserAuthenticated()

  await lucia.invalidateSession(session.id)

  const sessionCookie = lucia.createBlankSessionCookie()
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  )
  return redirect('/auth/signin')
}

async function checkIfUserAuthenticated() {
  const { session, user } = await validateRequest()
  if (!session) {
    return redirect('/auth/signin')
  }

  return { session, user }
}
