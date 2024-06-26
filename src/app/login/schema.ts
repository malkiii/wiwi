import { z } from 'zod';

export const formSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required.',
    })
    .trim()
    .email(),
  password: z
    .string({
      required_error: 'Password is required.',
    })
    .min(6, {
      message: 'Minimum 6 characters.',
    }),
});

export type FormValues = z.infer<typeof formSchema>;
