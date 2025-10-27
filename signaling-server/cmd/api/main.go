package main

import (
	"signaling-server/internal/calls"
	"signaling-server/internal/database"
	"signaling-server/internal/members"
	"signaling-server/internal/socket"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

var DB *gorm.DB

func main() {

	err := database.ConnectToDatabase()
	if err != nil {
		return
	}
	//members.Migrate()
	//calls.Migrate()
	router := gin.Default()
	router.Use(CORSMiddleware())
	socket.InitializeHub()
	membersGroup := router.Group("/members")
	{
		membersGroup.POST("", members.MakeNewMemberHandler)
	}

	callsGroup := router.Group("/calls")
	{
		callsGroup.POST("", calls.CreateCallHandler)
		callsGroup.POST("/join", calls.JoinCallHandler)
	}

	router.GET("/ws/:identifier", socket.HandleSocketConnection)

	err = router.Run("localhost:8081")
	if err != nil {
		return
	}
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Header("Access-Control-Allow-Methods", "POST,HEAD,PATCH, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
