import { usePostList } from '../state/post';
import { Post } from './Post';

export function PostList() {
  const posts = usePostList(null);

  return (
    <div>
      {posts.isLoading && <p>Loading...</p>}
      <div>
        {posts.data?.map((post) =>
          post ? <Post key={post?.id} post={post} /> : null,
        )}
      </div>
    </div>
  );
}
