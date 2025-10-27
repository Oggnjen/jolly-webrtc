package members

import (
	"log"
	"signaling-server/internal/database"

	"gorm.io/gorm"
)

type Member struct {
	Nickname   string `json:"nickname"`
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
