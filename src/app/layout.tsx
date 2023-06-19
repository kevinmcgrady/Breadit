import '@/styles/globals.css';

import { Inter } from 'next/font/google';

import NavBar from '@/components/NavBar';
import Providers from '@/components/Providers';
import { Toaster } from '@/components/ui/Toaster';
import { cn } from '@/lib/utils';

export const metadata = {
  title: 'Breadit',
  description: 'A Reddit clone built with Next.js and TypeScript.',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
  authModel,
}: {
  children: React.ReactNode;
  authModel: React.ReactNode;
}) {
  return (
    <html
      className={cn(
        'bg-white text-slate-900 antialiased light',
        inter.className,
      )}
      lang='en'
    >
      <body className='min-h-screen pt-12 bg-slate-50 antialiased'>
        <Providers>
          {/* @ts-expect-error server component */}
          <NavBar />
          {authModel}
          <div className='container max-w-7xl mx-auth h-full pt-12'>
            {children}
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
