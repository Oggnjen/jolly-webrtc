package socket

import (
	"sync"

	"github.com/gorilla/websocket"
)

type Hub struct {
	clients map[string]*websocket.Conn
	mu      sync.RWMutex
}

type Data struct {
	Sender     string
	Recipient  string
	RawData    string
	Type       string
	SenderName string
}
