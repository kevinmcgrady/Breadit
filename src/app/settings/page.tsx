import { notFound } from 'next/navigation';

import UsernameForm from '@/components/UsernameForm';
import { getAuthSession } from '@/lib/auth';

export const metadata = {
  title: 'Breadit - Settings',
  description: 'Manage account and website settings',
};

const SessingsPage = async () => {
  const session = await getAuthSession();

  if (!session?.user) {
    return notFound();
  }

  return (
    <div className='max-w-4xl mx-auto py-12'>
      <div className='grid items-start gap-8'>
        <h1 className='font-bold text-3xl md:text-4xl'>Settings</h1>
      </div>
      <div className='grid gap-10'>
        <UsernameForm
          user={{
            id: session.user.id,
            username: session.user.username || '',
          }}
        />
      </div>
    </div>
  );
};

export default SessingsPage;
