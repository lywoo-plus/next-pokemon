import * as z from 'zod';

const authCredentialsSchema = z.object({
  email: z.email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signInAuthFormSchema = authCredentialsSchema.extend({
  name: z.string(),
});

export const signUpAuthFormSchema = authCredentialsSchema.extend({
  name: z.string().min(1, 'Name is required'),
});

export type AuthFormValues = z.infer<typeof signUpAuthFormSchema>;
