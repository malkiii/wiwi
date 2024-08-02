import { z } from 'zod';

export const formSchema = z.object({
  name: z
    .string({
      required_error: 'First name is required.',
    })
    .trim()
    .min(3, {
      message: 'Minimum 3 characters.',
    })
    .max(35, {
      message: 'Maximum 35 characters.',
    }),
  email: z
    .string({
      required_error: 'Email is required.',
    })
    .trim()
    .email({
      message: 'Invalid email address.',
    }),
  message: z
    .string({
      required_error: 'Message is required.',
    })
    .trim()
    .min(50, {
      message: 'Your message must be at least 50 characters.',
    })
    .max(2500, {
      message: 'Your message must be less than 2500 characters.',
    }),
});

export type FormValues = z.infer<typeof formSchema>;
