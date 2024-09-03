package members

import (
	"gorm.io/gorm"
	"log"
	"signaling-server/internal/database"
)

type Member struct {
	Name       string `json:"name"`
	Surname    string `json:"surname"`
	Identifier string `json:"identifier" gorm:"index"`
	CallID     *uint  `json:"call_id"`
	gorm.Model
}

func Migrate() {
	err := database.DB.AutoMigrate(&Member{})
	if err != nil {
		log.Fatalf("Member migration failed: %v", err)
		return
	}
}
