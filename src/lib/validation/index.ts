import * as z from "zod";

export const SignupValidation = z.object({
  email: z.string().email(),
  name: z.string().min(2, { message: 'Please provide a valid name'}).max(60, { message: 'Names must have less than 60 characters'}),
  username: z.string().min(4, { message: 'Usernames must have at least 4 characters'}).max(30, { message: 'Usernames must have less than 30 characters'}),
  password: z.string().min(8, { message: 'Passwords must have at least 8 characters'}).max(30, { message: 'Passwords must have less than 30 characters'}),
})

export const SigninValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: 'Passwords must have at least 4 characters'}).max(30, { message: 'Passwords must have less than 30 characters'}),
})
