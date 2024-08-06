import { CSSProperties } from 'react';

import { PostList } from '../components/PostList';

export function PostPage() {
  return (
    <>
      <div style={postPageStyle}>
        <PostList />
      </div>
    </>
  );
}

const postPageStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  flexGrow: 1,
};
