'use client';

import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { FC, startTransition } from 'react';

import { Button } from '@/components/ui/Button';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { toast } from '@/hooks/use-toast';
import { SubscribeToSubredditPayload } from '@/lib/validators/subreddit';

type SubscribeLeaveToggleProps = {
  subredditId: string;
  subredditName: string;
  isSubscribed: boolean;
};

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({
  subredditId,
  subredditName,
  isSubscribed,
}) => {
  const { loginToast } = useCustomToast();
  const router = useRouter();

  const { isLoading: subscribeIsLoading, mutate: subscribeToSubreddit } =
    useMutation({
      mutationFn: async () => {
        const payload: SubscribeToSubredditPayload = {
          subredditId,
        };
        const { data } = await axios.post('/api/subreddit/subscribe', payload);

        return data as string;
      },
      onError: (err) => {
        if (err instanceof AxiosError) {
          if (err.response?.status === 401) {
            return loginToast();
          }
        }

        return toast({
          title: 'There was a problem.',
          description: 'Something went wrong, please try again.',
          variant: 'destructive',
        });
      },
      onSuccess: () => {
        startTransition(() => {
          router.refresh();
        });
        return toast({
          title: 'Subscribed!',
          description: `You are now subscribed to ${subredditName}`,
        });
      },
    });

  const { isLoading: unsubscribeIsLoading, mutate: unsubscribeToSubreddit } =
    useMutation({
      mutationFn: async () => {
        const payload: SubscribeToSubredditPayload = {
          subredditId,
        };
        const { data } = await axios.post(
          '/api/subreddit/unsubscribe',
          payload,
        );

        return data as string;
      },
      onError: (err) => {
        if (err instanceof AxiosError) {
          if (err.response?.status === 401) {
            return loginToast();
          }
        }

        return toast({
          title: 'There was a problem.',
          description: 'Something went wrong, please try again.',
          variant: 'destructive',
        });
      },
      onSuccess: () => {
        startTransition(() => {
          router.refresh();
        });
        return toast({
          title: 'Unsubscribed!',
          description: `You are now unsubscribed from ${subredditName}`,
        });
      },
    });

  return isSubscribed ? (
    <Button
      isLoading={unsubscribeIsLoading}
      onClick={() => unsubscribeToSubreddit()}
      className='w-full mt-1 mb-4'
    >
      Leave community
    </Button>
  ) : (
    <Button
      isLoading={subscribeIsLoading}
      onClick={() => subscribeToSubreddit()}
      className='w-full mt-1 mb-4'
    >
      Join to post
    </Button>
  );
};

export default SubscribeLeaveToggle;
