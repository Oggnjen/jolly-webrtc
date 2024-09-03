package calls

import (
	"errors"
	"github.com/google/uuid"
	"signaling-server/internal/database"
	"signaling-server/internal/members"
)

func createCall(memberIdentifier string) (CallIdentifierDto, error) {
	var member members.Member

	result := database.DB.Model(&members.Member{}).Where("identifier = ?", memberIdentifier).Find(&member)

	if result.RowsAffected == 0 {
		return CallIdentifierDto{}, errors.New("member does not exist")
	}

	if member.CallID != nil {
		return CallIdentifierDto{}, errors.New("call already exists")
	}
	callMembers := []members.Member{member}
	id := uuid.New()
	call := Call{
		CallMembers: callMembers,
		Identifier:  id.String(),
	}
	result = database.DB.Create(&call)
	if result.Error != nil {
		return CallIdentifierDto{}, result.Error
	}
	return CallIdentifierDto{Identifier: id.String()}, nil
}
