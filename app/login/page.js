'use client';

import { useFormState } from 'react-dom';
import Input from '@/components/input';
import Button from '@/components/btn';
import SocialLogin from '@/components/social-login';
import { login } from './actions';

export default function LoginPage() {
  const [state, dispatch] = useFormState(login, null);

  return (
    <div className='flex flex-col gap-10 py-8 px-6'>
      <div className='flex flex-col gap-2 *:font-medium'>
        <h1 className='text-2xl'>안녕하세요</h1>
        <h2 className=' text-xl'>Log in with email and password.</h2>
      </div>

      <form action={dispatch} className='flex flex-col gap-3'>
        <Input
          name='email'
          type='email'
          placeholder='Email'
          required
          errors={state?.fieldErrors.email}
        />
        <Input
          name='password'
          type='password'
          placeholder='Password'
          required
          errors={state?.fieldErrors.password}
        />
        <Button loading={false} text='Verify' />
      </form>

      <SocialLogin />
    </div>
  );
}
