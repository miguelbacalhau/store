import { useState } from 'react';

import { Post as PostState, useUpdatePost } from '../state/post';

type EditPostProps = { post: PostState };

export function EditPost({ post }: EditPostProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const { mutation: updatePost } = useUpdatePost();

  function handleUpdate() {
    updatePost({ id: post.id, title, description });
  }

  return (
    <div>
      <div>Edit Post</div>
      title:
      <input
        value={title}
        placeholder={post.title}
        onChange={(e) => setTitle(e.target.value)}
      />
      description:
      <input
        value={description}
        placeholder={post.description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
}
