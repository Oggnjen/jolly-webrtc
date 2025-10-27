package socket

import (
	"log"

	"github.com/gorilla/websocket"
)

var HubInstance *Hub

func InitializeHub() {
	HubInstance = &Hub{
		clients: make(map[string]*websocket.Conn),
	}
}

func (h *Hub) CreateNewSocketUser(conn *websocket.Conn, identifier string) {
	h.mu.Lock()
	defer h.mu.Unlock()
	h.clients[identifier] = conn
	log.Printf("Client with identifier: %s connected", identifier)
}

func (h *Hub) DisconnectUser(identifier string) {
	h.mu.Lock()
	defer h.mu.Unlock()

	if user, exist := h.clients[identifier]; exist {
		user.Close()
		delete(h.clients, identifier)
		log.Printf("Client with identifier: %s disconnected", identifier)
	}
}

func (h *Hub) SendMessageToUser(identifier string, messageType int, data []byte) error {
	h.mu.RLock()
	defer h.mu.RUnlock()

	if user, exist := h.clients[identifier]; exist {
		return user.WriteMessage(websocket.TextMessage, data)
	}
	return nil
}
