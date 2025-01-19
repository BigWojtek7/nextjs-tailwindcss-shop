import { FC } from 'react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { Button } from '@/app/ui/button';

interface LoginFormProps {
  email: string;
  password: string;
}

export const Login: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormProps>();

  const onSubmit = async (data: LoginFormProps) => {
    await signIn('credentials', { ...data });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input
        {...register('email', { required: 'Email jest wymagany' })}
        type="email"
        placeholder="Email"
        className="input input-bordered w-full"
      />
      {errors.email && <span>{errors.email.message}</span>}

      <input
        {...register('password', { required: 'Hasło jest wymagane' })}
        type="password"
        placeholder="Hasło"
        className="input input-bordered w-full"
      />
      {errors.password && <span>{errors.password.message}</span>}

      <Button type="submit">Zaloguj się</Button>
    </form>
  );
};
