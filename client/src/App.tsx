import "./App.css";
import { Layout, UserInfo } from "./components";
import { useInitializeUserStore, WebsocketWrapper } from "./logic-layer";

function App() {
  useInitializeUserStore();
  return (
    <>
      <WebsocketWrapper>
        <Layout>
          <UserInfo />
        </Layout>
      </WebsocketWrapper>
    </>
  );
}

export default App;
