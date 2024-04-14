'use server';

import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
} from '@/lib/constants';
import { z } from 'zod';

const passwordRegex = PASSWORD_REGEX;

const checkPassword = ({ password, confirmPassword }) =>
  password === confirmPassword;

const formSchema = z
  .object({
    username: z.string().trim(),
    email: z.string().email().toLowerCase(),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, 'Password should be at least 5 characters')
      .max(PASSWORD_MAX_LENGTH, 'Password is too long')
      .regex(
        passwordRegex,
        'A password must have a-z, A-Z, 0-9 and special characters[#?!@$%^&*-]'
      ),
    confirmPassword: z.string(),
  })
  .refine(checkPassword, {
    message: 'Both passwords should be the same!',
    path: ['confirmPassword'],
  });

export async function createAccount(prevState, formData) {
  const data = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  };

  const result = formSchema.safeParse(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    return;
  }
}
