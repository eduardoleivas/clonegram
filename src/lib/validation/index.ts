import * as z from "zod";

export const SignupValidation = z.object({
  email: z.string().email(),
  name: z.string().min(2, { message: "Please provide a valid name"}).max(60, { message: "Names must have less than 60 characters"}),
  username: z.string().min(4, { message: "Usernames must have at least 4 characters"}).max(30, { message: "Usernames must have less than 30 characters"}),
  password: z.string().min(8, { message: "Passwords must have at least 8 characters"}).max(30, { message: "Passwords must have less than 30 characters"}),
})

export const SigninValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "Passwords must have at least 4 characters"}).max(30, { message: "Passwords must have less than 30 characters"}),
})

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2, { message: "Please provide a valid name"}).max(60, { message: "Names must have less than 60 characters"}),
  username: z.string().min(4, { message: "Usernames must have at least 4 characters"}).max(30, { message: "Usernames must have less than 30 characters"}),
  email: z.string().email(),
  bio: z.string().max(150, {message: "Your Bio must have less than 150 characters"}),
});

export const PostValidation = z.object({
  placeholder: z.string(),
  file: z.custom<File[]>(),
  location: z.string().max(160, {message: "Locations must have less than 160 characters"}),
  tags: z.string().max(160, {message: "Tags must have less than 160 characters"}),
})

export const commentValidation = z.object({
  comment: z.string().max(160, {message: "Comments must have less than 160 characters"}),
})
