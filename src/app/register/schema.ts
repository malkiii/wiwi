import { z } from 'zod';

export const formSchema = z.object({
  firstName: z
    .string({
      required_error: 'First name is required.',
    })
    .trim()
    .min(3, {
      message: 'Minimum 3 characters.',
    })
    .max(16, {
      message: 'Maximum 16 characters.',
    })
    .regex(/^[a-zA-Z]+$/, {
      message: 'Only letters are allowed.',
    }),
  lastName: z
    .string()
    .trim()
    .max(16, {
      message: 'Maximum 16 characters.',
    })
    .regex(/^[a-zA-Z]+$/, {
      message: 'Only letters are allowed.',
    })
    .optional(),
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
  terms: z.boolean({
    required_error: 'You must agree with the terms.',
  }),
});

export type FormValues = z.infer<typeof formSchema>;
