package calls

import (
	"errors"
	"github.com/google/uuid"
	"signaling-server/internal/database"
	"signaling-server/internal/members"
	"signaling-server/internal/utils"
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

func joinCall(callIdentifier string, memberIdentifier string) (JoinedCallDto, error) {
	var member members.Member

	result := database.DB.Model(&members.Member{}).Where("identifier = ?", memberIdentifier).Find(&member)

	if result.RowsAffected == 0 {
		return JoinedCallDto{}, errors.New("member does not exist")
	}
	if member.CallID != nil {
		return JoinedCallDto{}, errors.New("you are already in call")
	}

	var call Call

	result = database.DB.Where("identifier = ?", callIdentifier).Preload("CallMembers").Find(&call)
	if result.RowsAffected == 0 {
		return JoinedCallDto{}, errors.New("call does not exist")
	}
	joinedMembers := utils.Map(call.CallMembers, func(item members.Member) members.MemberDto { return item.MapToMemberDto() })

	call.CallMembers = append(call.CallMembers, member)
	result = database.DB.Save(&call)
	if result.Error != nil {
		return JoinedCallDto{}, result.Error
	}

	return JoinedCallDto{Identifier: call.Identifier, Members: joinedMembers}, nil
}
