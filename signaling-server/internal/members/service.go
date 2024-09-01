package members

import (
	"github.com/google/uuid"
	"signaling-server/internal/database"
)

func makeNewMember(dto *MemberDto) (MemberDto, error) {
	id := uuid.New()

	member := Member{
		Name:       dto.Name,
		Surname:    dto.Surname,
		Identifier: id.String(),
	}
	result := database.DB.Create(&member)
	if result.Error != nil {
		return MemberDto{}, result.Error
	}
	return member.MapToMemberDto(), nil
}
