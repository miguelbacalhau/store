import { CSSProperties, useRef } from 'react';

import { space200 } from '../../src/devTools/cssTokens/spacings';
import { Post as PostState } from '../state/post';
import { Popover } from '../ui/Popover';
import { EditPost } from './EditPost';

type PostProps = { post: PostState };

export function Post({ post }: PostProps) {
  const triggerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div style={postStyle} ref={triggerRef}>
        <h1>{post.title}</h1>
        <p>{post.description}</p>
      </div>

      <Popover triggerRef={triggerRef}>
        <EditPost post={post} />
      </Popover>
    </>
  );
}

const postStyle: CSSProperties = {
  padding: space200,
};
