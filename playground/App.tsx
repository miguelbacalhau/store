import { DevToolsProvider } from '../src/devTools/DevToolsProvider';
import { RouterProvider } from '../src/devTools/router/RouterProvider';
import { useRouter } from '../src/devTools/router/useRouter';
import { PostPage } from './pages/PostPage';

function Root() {
  const { currentRoute } = useRouter();

  switch (currentRoute) {
    case 'posts':
      return <PostPage />;
    default:
      return <PostPage />;
  }
}

function App() {
  return (
    <div style={appStyle}>
      <DevToolsProvider>
        <RouterProvider>
          <Root />
        </RouterProvider>
      </DevToolsProvider>
    </div>
  );
}

const appStyle = { display: 'flex' };

export default App;
