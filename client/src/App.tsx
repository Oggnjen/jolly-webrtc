import "./App.css";
import { CallDecision, Layout, MainCamera, UserInfo } from "./components";
import {
  useIdentifier,
  useInitializeUserStore,
  WebsocketWrapper,
} from "./logic-layer";
import { MediaStoreProvider } from "./media-context";

function App() {
  useInitializeUserStore();
  const userIdentifier = useIdentifier();
  return (
    <>
      <MediaStoreProvider>
        <WebsocketWrapper>
          <Layout>
            <div>
              <MainCamera />
              {userIdentifier == null && <UserInfo />}
              {userIdentifier != null && <CallDecision />}
            </div>
          </Layout>
        </WebsocketWrapper>
      </MediaStoreProvider>
    </>
  );
}

export default App;
