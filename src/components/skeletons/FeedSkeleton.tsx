import { FC } from 'react';

const FeedSkeleton: FC = () => {
  return (
    <div className='flex flex-col col-span-2 space-y-6 animate-pulse'>
      <div className='rounded-md shadow bg-white'>
        <div className='px-6 py-4 flex justify-between h-[172px]'>
          <div className='flex sm:flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0'></div>
          <div className='w-0 flex-1'></div>
        </div>
        <div className='bg-gray-50 z-20 text-sm p-4 sm:px-6'></div>
      </div>
      <div className='rounded-md shadow bg-white'>
        <div className='px-6 py-4 flex justify-between h-[172px]'>
          <div className='flex sm:flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0'></div>
          <div className='w-0 flex-1'></div>
        </div>
        <div className='bg-gray-50 z-20 text-sm p-4 sm:px-6'></div>
      </div>
      <div className='rounded-md shadow bg-white'>
        <div className='px-6 py-4 flex justify-between h-[172px]'>
          <div className='flex sm:flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0'></div>
          <div className='w-0 flex-1'></div>
        </div>
        <div className='bg-gray-50 z-20 text-sm p-4 sm:px-6'></div>
      </div>
    </div>
  );
};

export default FeedSkeleton;
