package members

type MemberDto struct {
	Nickname   string `json:"nickname"`
	Identifier string `json:"identifier"`
}

func (member Member) MapToMemberDto() MemberDto {
	return MemberDto{Nickname: member.Nickname, Identifier: member.Identifier}
}
