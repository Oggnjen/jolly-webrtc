package calls

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func CreateCallHandler(c *gin.Context) {
	identifier := c.Query("memberIdentifier")

	createdCall, err := createCall(identifier)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, createdCall)
	return
}

func JoinCallHandler(c *gin.Context) {
	memberIdentifier := c.Query("memberIdentifier")
	callIdentifier := c.Query("callIdentifier")

	joinedCall, err := joinCall(callIdentifier, memberIdentifier)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusAccepted, joinedCall)
	return
}
