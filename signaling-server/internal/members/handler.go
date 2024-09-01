package members

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func MakeNewMemberHandler(c *gin.Context) {
	var newMember MemberDto

	if err := c.ShouldBindJSON(&newMember); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	createdMember, err := makeNewMember(&newMember)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, createdMember)
	return
}
