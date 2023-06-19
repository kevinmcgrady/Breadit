'use client';

import { signIn } from 'next-auth/react';
import { FC, useState } from 'react';

import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

import { Icons } from './Icons';
import { Button } from './ui/Button';

interface UserAuthFormProps extends React.HtmlHTMLAttributes<HTMLDivElement> {}

const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const loginInWithGoogle = async () => {
    setIsLoading(true);

    try {
      await signIn('google');
    } catch (error) {
      toast({
        title: 'There was a problem',
        description: 'There was an error loggin in with Google',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={loginInWithGoogle}
      className={cn('flex justify-center', className)}
      {...props}
    >
      <Button size='sm' className='w-full' isLoading={isLoading}>
        {!isLoading && <Icons.google className='h-4 w-4 mr-2' />}
        Google
      </Button>
    </div>
  );
};

export default UserAuthForm;
