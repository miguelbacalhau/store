import { useCommentList } from '../state/comments';

export function CommentList() {
  const comments = useCommentList(null);

  return (
    <div>
      {comments.isLoading && <p>Loading...</p>}
      <div>
        {comments.data?.map((comment) => (
          <div key={comment?.id}>
            <p>{comment?.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
