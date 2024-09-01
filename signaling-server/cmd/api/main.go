package main

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"signaling-server/internal/database"
	"signaling-server/internal/members"
)

var DB *gorm.DB

func main() {

	err := database.ConnectToDatabase()
	if err != nil {
		return
	}
	members.Migrate()
	router := gin.Default()

	membersGroup := router.Group("/members")
	{
		membersGroup.POST("", members.MakeNewMemberHandler)
	}

	err = router.Run("localhost:8080")
	if err != nil {
		return
	}
}
