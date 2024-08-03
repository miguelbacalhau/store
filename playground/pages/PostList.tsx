import { usePostList } from '../state/post';

export function PostList() {
  const posts = usePostList();

  return (
    <div>
      {posts.isLoading && <p>Loading...</p>}
      <div>
        {posts.data?.map((post) => (
          <div key={post.id}>
            <h1>{post.title}</h1>
            <p>{post.descrption}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
