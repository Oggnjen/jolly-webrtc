import { useEffect, type ReactNode } from "react";
import { useIdentifier } from "../user/hooks";
import { DataType, type Data, type SendToSignalingServerEvent } from "./types";
import {
  dispatchAcceptAnswer,
  dispatchAcceptIceCandidate,
  dispatchAcceptOfferAndSendAnswer,
} from "../events/functions";

export const WebsocketWrapper = ({ children }: { children: ReactNode }) => {
  // const [ws, setWs] = useState<WebSocket | null>(null);
  const identifier = useIdentifier();
  useEffect(() => {
    // Establish WebSocket connection
    if (identifier != null) {
      const newWs = new WebSocket(`ws://localhost:8081/ws/${identifier}`);

      newWs.onopen = () => {
        console.log("WebSocket connection established.");
        // Send initial message or subscribe to topics
      };

      window.addEventListener("send-to-signaling-server", ((
        e: SendToSignalingServerEvent
      ) => {
        newWs?.send(e.detail.payload);
      }) as EventListener);

      newWs.onmessage = (event) => {
        const data = JSON.parse(event.data) as Data;
        if (data.Type == DataType.SDP_OFFER) {
          dispatchAcceptOfferAndSendAnswer(
            data.Sender,
            data.RawData,
            data.SenderName || ""
          );
        } else if (data.Type == DataType.SDP_ANSWER) {
          dispatchAcceptAnswer(data.Sender, data.RawData);
        } else if (data.Type == DataType.ICE_CANDIDATE) {
          dispatchAcceptIceCandidate(data.Sender, data.RawData);
        }
        // const data = JSON.parse(event.data);
        // setMessages((prevMessages) => [...prevMessages, data]);
      };

      newWs.onclose = () => {
        console.log("WebSocket connection closed.");
      };

      newWs.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      // setWs(newWs);

      // Clean up on component unmount
      return () => {
        newWs.close();
      };
    }
  }, [identifier]);

  return <div>{children}</div>;
};
