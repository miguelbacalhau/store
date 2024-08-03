import { DevToolsProvider } from '../src/devTools/DevToolsProvider';
import { CommentList } from './pages/CommentList';
import { PersonList } from './pages/PersonList';
import { PostList } from './pages/PostList';

function App() {
  return (
    <div style={appStyle}>
      <PersonList />
      <PostList />
      <CommentList />
      <DevToolsProvider />
    </div>
  );
}

const appStyle = { display: 'flex' };

export default App;
