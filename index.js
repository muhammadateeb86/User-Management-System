// CJS
const { faker } = require('@faker-js/faker'); // Import the faker package
const mysql = require('mysql2'); // Import the mysql2 package
const express = require('express');
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require('uuid'); // Import the uuid package for generating unique IDs
require('dotenv').config();

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost', // Your database host
  user: dbUser, // Your database username
  password: dbPass, // Your database password
  database: 'userData' // Your database name
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as ID', connection.threadId);
});

// Home route
app.get("/", (req, res) => {
  let q = "SELECT COUNT(*) AS count FROM data";
  connection.query(q, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("There was some error");
    }
    let count = result[0].count;
    res.render("home.ejs", { count });
  });
});

// Users route
app.get("/users", (req, res) => {
  let q = "SELECT * FROM data";
  connection.query(q, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("There was some error");
    }
    res.render("showUsers.ejs", { result });
  });
});

// Edit user route
app.get("/users/:id/edit", (req, res) => {
  const id = req.params.id;
  const q = `SELECT * FROM data WHERE id='${id}'`;
  
  connection.query(q, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("There was some error");
    }

    const user = result[0];
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.render("editForm.ejs", { user });
  });
});

// Update user route
app.patch("/users/:id", (req, res) => {
  const id = req.params.id;
  const { password: forPass, userName, email } = req.body;

  const selectQuery = `SELECT * FROM data WHERE id='${id}'`;
  
  connection.query(selectQuery, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("There was some error");
    }

    const user = result[0];
    if (!user) {
      return res.status(404).send("User not found");
    }

    if (forPass !== user.password) {
      return res.send("Wrong Password");
    }

    // If the password matches, update the user details
    const updateQuery = `UPDATE data SET userName=?, email=? WHERE id=?`;
    connection.query(updateQuery, [userName, email, id], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send("There was some error");
      }
      res.redirect("/users");
    });
  });
});

// Add user form route
app.get("/users/add", (req, res) => {
  res.render("addForm.ejs"); // Render the add user form
});

// Handle adding a new user
// Handle adding a new user
app.post("/users/add", (req, res) => {
  const { username, email, password } = req.body; // Ensure this matches your form field names
  const id = uuidv4(); // Generate a unique ID

  const query = `INSERT INTO data (id, name, email, password) VALUES (?, ?, ?, ?)`;
  
  connection.query(query, [id, username, email, password], (err) => {
    if (err) {
      console.error('Error adding user:', err);
      // Handle unique constraint violations for email or name
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).send("Email or username already exists");
      }
      return res.status(500).send("Error adding user");
    }
    res.redirect("/users"); // Redirect to the users list after adding
  });
});

app.get("/users/:id/delete", (req, res) => {
  const id = req.params.id;
  const q = `SELECT * FROM data WHERE id='${id}'`;
  
  connection.query(q, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("There was some error");
    }

    const user = result[0];
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.render("deleteForm.ejs", { user });
  });
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const { password: forPass } = req.body; // Ensure this matches your form field name
  const selectQuery = `SELECT * FROM data WHERE id=?`; // Use parameterized query for security
  
  connection.query(selectQuery, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("There was some error");
    }

    const user = result[0];
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Compare the provided password with the stored password
    if (forPass !== user.password) {
      return res.send("Wrong Password");
    }

    const deleteQuery = `DELETE FROM data WHERE id=?`;
    connection.query(deleteQuery, [id], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send("There was some error");
      }
      res.redirect("/users");
    });
  });
});

// Don't forget to close the connection when you're done
// connection.end();
