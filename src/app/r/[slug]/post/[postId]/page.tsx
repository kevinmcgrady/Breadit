import { Post, User, Vote } from '@prisma/client';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import CommentsSection from '@/components/CommentsSection';
import EditorOutput from '@/components/EditorOutput';
import PostVoteServer from '@/components/post-vote/PostVoteServer';
import CommentsSectionSkeleton from '@/components/skeletons/CommentsSectionSkeleton';
import PostVoteSkeleton from '@/components/skeletons/PostVoteSkeleton';
import { db } from '@/lib/db';
import { redis } from '@/lib/redis';
import { formatTimeToNow } from '@/lib/utils';
import { CachedPost } from '@/types/redis';

type PageProps = {
  params: {
    postId: string;
  };
};

const SinglePostPage = async ({ params }: PageProps) => {
  const cachedPost = (await redis.hgetall(
    `post:${params.postId}`,
  )) as CachedPost;

  let post: (Post & { votes: Vote[]; author: User }) | null = null;

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: params.postId,
      },
      include: {
        votes: true,
        author: true,
      },
    });
  }

  if (!post && !cachedPost) {
    return notFound();
  }

  return (
    <div>
      <div className='h-full flex flex-col sm:flex-row items-center sm:items-start justify-between'>
        <Suspense fallback={<PostVoteSkeleton />}>
          {/* @ts-ignore-error server component */}
          <PostVoteServer
            postId={post?.id ?? cachedPost.id}
            getData={async () => {
              return await db.post.findUnique({
                where: {
                  id: params.postId,
                },
                include: {
                  votes: true,
                },
              });
            }}
          />
        </Suspense>
        <div className='sm:w-0 w-full flex-1'>
          <div className='bg-white p-4 rounded-sm'>
            <p className='max-h-40 mt-1 truncate text-xs text-gray-500'>
              Posted by u/{post?.author?.username ?? cachedPost.authorUsername}{' '}
              {formatTimeToNow(
                new Date(post?.createdAt ?? cachedPost.createdAt),
              )}
            </p>
            <h1 className='text-xl font-semibold py-2 leading-6 text-gray-900'>
              {post?.title ?? cachedPost.title}
            </h1>
            <EditorOutput content={post?.content ?? cachedPost.content} />
          </div>
          <Suspense fallback={<CommentsSectionSkeleton />}>
            {/* @ts-ignore-error server component */}
            <CommentsSection postId={post?.id ?? cachedPost.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default SinglePostPage;
