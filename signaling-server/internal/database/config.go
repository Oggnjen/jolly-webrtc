package database

import (
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
	"os"
)

var DB *gorm.DB

func ConnectToDatabase() error {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	DbConnect := os.Getenv("DB_CONNECT")
	db, err := gorm.Open(postgres.Open(DbConnect), &gorm.Config{})
	if err != nil {
		return err
	}

	DB = db
	return nil
}
