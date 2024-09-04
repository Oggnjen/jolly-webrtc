package calls

import "signaling-server/internal/members"

type CallIdentifierDto struct {
	Identifier string `json:"identifier"`
}

type JoinedCallDto struct {
	Identifier string              `json:"identifier"`
	Members    []members.MemberDto `json:"members"`
}
