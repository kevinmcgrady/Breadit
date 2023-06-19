import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';

import CreateComment from './CreateComment';
import PostComment from './PostComment';

type CommentsSectionProps = {
  postId: string;
};

const CommentsSection = async ({ postId }: CommentsSectionProps) => {
  const session = await getAuthSession();

  const comments = await db.comment.findMany({
    where: {
      postId,
      replyTo: null,
    },
    include: {
      author: true,
      votes: true,
      replies: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  return (
    <div className='flex flex-col gap-y-4 mt-4'>
      <hr className='w-full h-px my-6' />
      <CreateComment postId={postId} />
      <div className='flex flex-col gap-y-6 mt-4'>
        {comments
          .filter((comment) => !comment.replyToId)
          .map((topLevelComment) => {
            const topLevelCommentsVoteAmount = topLevelComment.votes.reduce(
              (acc, vote) => {
                if (vote.type === 'UP') return acc + 1;
                if (vote.type === 'DOWN') return acc - 1;
                return acc;
              },
              0,
            );

            const topLevelCommentsVote = topLevelComment.votes.find(
              (vote) => vote.userId === session?.user.id,
            );

            return (
              <div key={topLevelComment.id} className='flex flex-col'>
                <div className='mb-2'>
                  <PostComment
                    comment={topLevelComment}
                    postId={postId}
                    currentVote={topLevelCommentsVote}
                    votesAmount={topLevelCommentsVoteAmount}
                  />
                </div>

                {topLevelComment.replies
                  .sort((a, b) => b.votes.length - a.votes.length)
                  .map((reply) => {
                    const replyCommentsVoteAmount = reply.votes.reduce(
                      (acc, vote) => {
                        if (vote.type === 'UP') return acc + 1;
                        if (vote.type === 'DOWN') return acc - 1;
                        return acc;
                      },
                      0,
                    );

                    const replyCommentsVote = reply.votes.find(
                      (vote) => vote.userId === session?.user.id,
                    );

                    return (
                      <div
                        key={reply.id}
                        className='ml-2 py-2 pl-2 border-l-2 border-zinc-200'
                      >
                        <PostComment
                          comment={reply}
                          currentVote={replyCommentsVote}
                          votesAmount={replyCommentsVoteAmount}
                          postId={postId}
                        />
                      </div>
                    );
                  })}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CommentsSection;
