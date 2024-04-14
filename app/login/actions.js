'use server';

import { z } from 'zod';

const loginFormSchema = z.object({
  email: z.string().min(1, 'Email is required').email().toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export async function login(prevState, formData) {
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const result = loginFormSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  }
}
