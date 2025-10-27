import React, { useEffect, useState, type ReactNode } from "react";
import { useIdentifier } from "../user/hooks";

export const WebsocketWrapper = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const identifier = useIdentifier();
  useEffect(() => {
    // Establish WebSocket connection
    if (identifier != null) {
      const newWs = new WebSocket(`ws://localhost:8081/ws/${identifier}`);

      newWs.onopen = () => {
        console.log("WebSocket connection established.");
        // Send initial message or subscribe to topics
        newWs.send(JSON.stringify({ type: "subscribe", topic: "updates" }));
      };

      newWs.onmessage = (event) => {
        console.log(event);
        // const data = JSON.parse(event.data);
        // setMessages((prevMessages) => [...prevMessages, data]);
      };

      newWs.onclose = () => {
        console.log("WebSocket connection closed.");
      };

      newWs.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      setWs(newWs);

      // Clean up on component unmount
      return () => {
        newWs.close();
      };
    }
  }, [identifier]);

  return <div>{children}</div>;
};
