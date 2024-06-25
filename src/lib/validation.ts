import { z } from 'zod';

export const authCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const userCredentialsSchema = authCredentialsSchema.merge(
  z.object({ name: z.string().min(3).max(35) }),
);

export type UserCredentials = z.infer<typeof userCredentialsSchema>;
