package calls

import (
	"gorm.io/gorm"
	"log"
	"signaling-server/internal/database"
	"signaling-server/internal/members"
)

type Call struct {
	Identifier  string           `json:"identifier"`
	CallMembers []members.Member `json:"call_members" gorm:"foreignKey:CallID"`
	gorm.Model
}

func Migrate() {
	err := database.DB.AutoMigrate(&Call{})
	if err != nil {
		log.Fatalf("Member migration failed: %v", err)
		return
	}
}
