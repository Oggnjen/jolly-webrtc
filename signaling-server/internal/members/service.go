package members

import (
	"signaling-server/internal/database"

	"github.com/google/uuid"
)

func makeNewMember(dto *MemberDto) (MemberDto, error) {
	id := uuid.New()

	member := Member{
		Nickname:   dto.Nickname,
		Identifier: id.String(),
	}
	result := database.DB.Create(&member)
	if result.Error != nil {
		return MemberDto{}, result.Error
	}
	return member.MapToMemberDto(), nil
}
