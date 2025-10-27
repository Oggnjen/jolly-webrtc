package database

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectToDatabase() error {
	environment := os.Getenv("ENVIRONMENT")
	if environment != "PRODUCTION" {
		err := godotenv.Load()
		if err != nil {
			fmt.Println(err)
			log.Fatal("Error loading .env file")
		}
	}

	DbConnect := os.Getenv("DB_CONNECT")
	db, err := gorm.Open(postgres.Open(DbConnect), &gorm.Config{})

	Migration()
	if err != nil {
		return err
	}

	DB = db
	return nil
}
