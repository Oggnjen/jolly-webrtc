package socket

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		// Allow all origins for simplicity (adjust for production)
		return true
	},
}

func HandleSocketConnection(c *gin.Context) {

	identifier, exist := c.Params.Get("identifier")
	if !exist {
		return
	}
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		fmt.Println("Upgrade error:", err)
		return
	}
	HubInstance.CreateNewSocketUser(conn, identifier)
	defer HubInstance.DisconnectUser(identifier)

	for {
		// Read message
		var data Data

		err := conn.ReadJSON(&data)

		if err != nil {
			fmt.Println(err.Error())
			fmt.Println("Error occured")
			break
		}

		payload, err := json.Marshal(data)

		if err != nil {
			fmt.Println("Error occured")
			break
		}

		HubInstance.SendMessageToUser(data.Recipient, websocket.TextMessage, payload)
	}
}
