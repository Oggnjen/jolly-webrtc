import './App.css';
import { CallDecision, CallRoom, Layout, UserInfo } from './components';
import { useCallIdentifier, useIdentifier, useInitializeUserStore, WebsocketWrapper } from './logic-layer';
import { MediaStoreProvider } from './media-context';

function App() {
  useInitializeUserStore();
  const userIdentifier = useIdentifier();
  const callIdentifier = useCallIdentifier();
  return (
    <>
      <MediaStoreProvider>
        <WebsocketWrapper>
          <Layout>
            <div>
              {userIdentifier == null && callIdentifier == null && <UserInfo />}
              {userIdentifier != null && callIdentifier == null && <CallDecision />}
              {callIdentifier != null && <CallRoom />}
            </div>
          </Layout>
        </WebsocketWrapper>
      </MediaStoreProvider>
    </>
  );
}

export default App;
