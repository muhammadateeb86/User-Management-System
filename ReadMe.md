# User Management System

## Description
This project is a simple user management system built using Node.js, Express, and MySQL. It allows users to create, read, update, and delete user records. The frontend is rendered using EJS templates.

## Features
- Add new users with unique IDs
- View all users
- Edit user details
- Delete users
- Uses environment variables for sensitive information

## Requirements
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)

## Installation

### 1. Clone the Repository
Clone this repository to your local machine using:

git clone https://github.com/muhammadateeb86/User-Management-System


# Navigate to Project Directory 
change project directory
cd your-repo

# Install Dependencies
npm install

# Set Up the MySQL Database
CREATE DATABASE userData;
CREATE TABLE data (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

# Configure Environment Variables
DB_USER=your_database_username
DB_PASS=your_database_password

# Running the Application
node index.js

Open your browser and navigate to http://localhost:8080.

# Usage

    Home Page: Displays the total number of users.
    Users List: View all users and their details.
    Add User: Fill out the form to add a new user.
    Edit User: Modify existing user information.
    Delete User: Remove a user after confirming the password.

# Important Notes

    Ensure your MySQL server is running and accessible.
    Always keep your .env file secure and avoid sharing it publicly. This file is ignored in GitHub via .gitignore.

# Troubleshooting

    If you encounter any issues connecting to the database, double-check your .env configuration and ensure your MySQL server is running.
    Common errors may include unique constraint violations, which occur if you try to add a user with an email or username that already exists.

# Acknowledgments
    Node.js
    Express
    MySQL
    EJS
    Faker


### Summary

This `README.md` provides clear instructions for setup, usage, and troubleshooting, making it easy for others to understand and work with your project. Adjust the placeholders (like `yourusername` and `your-repo`) to match your actual GitHub username and repository name.
