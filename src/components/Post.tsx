import { Post, User, Vote } from '@prisma/client';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { FC, Fragment, useRef } from 'react';

import EditorOutput from '@/components/EditorOutput';
import PostVoteClient from '@/components/post-vote/PostVoteClient';
import { formatTimeToNow } from '@/lib/utils';

type PartialVote = Pick<Vote, 'type'>;

type PostProps = {
  subredditName: string;
  post: Post & {
    author: User;
    votes: Vote[];
  };
  commentAmount: number;
  votesAmount: number;
  currentVote?: PartialVote;
};

const Post: FC<PostProps> = ({
  subredditName,
  post,
  commentAmount,
  votesAmount,
  currentVote,
}) => {
  const postRef = useRef<HTMLDivElement>(null);

  return (
    <div className='rounded-md bg-white shadow'>
      <div className='px-6 py-4 flex justify-between'>
        <PostVoteClient
          initialVotesAmount={votesAmount}
          postId={post.id}
          initialVote={currentVote?.type}
        />
        <div className='w-0 flex-1'>
          <div className='max-h-40 mt-1 text-xs text-gray-500'>
            {subredditName && (
              <Fragment>
                <Link
                  className='underline text-zinc-900 text-sm underline-offset-2'
                  href={`/r/${subredditName}`}
                >
                  r/{subredditName}
                </Link>
                <span className='px-1'>-</span>
              </Fragment>
            )}
            <span>Posted by u/{post.author.username}</span>{' '}
            {formatTimeToNow(new Date(post.createdAt))}
          </div>
          <Link href={`/r/${subredditName}/post/${post.id}`}>
            <h1 className='text-lg font-semibold py-2 leading-6 text-gray-900'>
              {post.title}
            </h1>
          </Link>
          <div
            className='relative text-sm max-h-40 w-full overflow-clip'
            ref={postRef}
          >
            <EditorOutput content={post.content} />
            {postRef.current?.clientHeight === 160 && (
              <div className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent' />
            )}
          </div>
        </div>
      </div>

      <div className='bg-gray-50 z-20 text-sm p-4 sm:px-6'>
        <Link
          className='w-fit flex items-center gap-2'
          href={`/r/${subredditName}/post/${post.id}`}
        >
          <MessageSquare className='h-4 w-4' /> {commentAmount} comments
        </Link>
      </div>
    </div>
  );
};

export default Post;
