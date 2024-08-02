import { z } from 'zod';

export const formSchema = z
  .object({
    password: z
      .string({
        required_error: 'Password is required.',
      })
      .min(6, {
        message: 'Minimum 6 characters.',
      }),
    confirm: z.string({
      required_error: 'You have to confirm your password.',
    }),
  })
  .refine(data => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ['confirm'], // This specifies which field is invalid
  });

export type FormValues = z.infer<typeof formSchema>;
