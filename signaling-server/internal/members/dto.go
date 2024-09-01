package members

type MemberDto struct {
	Name       string `json:"name"`
	Surname    string `json:"surname"`
	Identifier string `json:"identifier"`
}

func (member Member) MapToMemberDto() MemberDto {
	return MemberDto{Name: member.Name, Surname: member.Surname, Identifier: member.Identifier}
}
