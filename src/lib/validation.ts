import { z } from 'zod';

export const authCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const usernameSchema = z
  .string()
  .min(3)
  .max(35)
  .regex(/^[a-zA-Z]+$/);

export const userCredentialsSchema = authCredentialsSchema.merge(
  z.object({ name: usernameSchema }),
);

export type UserCredentials = z.infer<typeof userCredentialsSchema>;
