package main

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"signaling-server/internal/calls"
	"signaling-server/internal/database"
	"signaling-server/internal/members"
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

	membersGroup := router.Group("/members")
	{
		membersGroup.POST("", members.MakeNewMemberHandler)
	}

	callsGroup := router.Group("/calls")
	{
		callsGroup.POST("", calls.CreateCallHandler)
		callsGroup.POST("/join", calls.JoinCallHandler)
	}

	err = router.Run("localhost:8080")
	if err != nil {
		return
	}
}
