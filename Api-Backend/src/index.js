const app = require("express")();
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const PORT = 8080;
let sql;

app.use(cors());

const bodyParser = require("body-parser");

app.use(bodyParser.json());

const users = new sqlite3.Database(
  path.join(__dirname, "users.db"),
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Connected to the users database.");
    }
  }
);

const lists = new sqlite3.Database(
  path.join(__dirname, "lists.db"),
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Connected to the lists database.");
    }
  }
);

sql = "CREATE TABLE IF NOT EXISTS lists (autor text, title text, content text)";
lists.run(sql, (err) => {
  if (err) {
    console.error(err.message);
  }
});

sql = "CREATE TABLE IF NOT EXISTS users (name TEXT, email TEXT, password TEXT)";
users.run(sql, (err) => {
  if (err) {
    console.error(err.message);
  }
});

sqlall = "SELECT * FROM users";
users.all(sqlall, [], (err, rows) => {
  if (err) {
    console.error(err.message);
    return;
  }
});

app.get("/test", (req, res) => {
  res.status(200).send({
    data: "hello",
  });
});

app.post("/getlist", (req, res) => {
  const listName = req.body.chosenList;
  const username = req.body.user;
  if (username == "admin") {
    if (!listName) {
      res.status(400).send("List name is required.");
      return;
    }
    lists.all(
      "SELECT content FROM lists WHERE title = ?",
      [listName],
      (err, rows) => {
        if (err) {
          console.error(err.message);
          res.status(500).send("An error occurred while fetching the list.");
          return;
        }
        if (rows.length === 0) {
          console.log("No matching records found. Admin Error.");
          res.status(404).send("List not found.");
          return;
        }
        const contentArray = rows.map((row) => row.content);
        res.status(200).send(contentArray);
      }
    );
  } else {
    if (!listName) {
      res.status(400).send("List name is required.");
      return;
    }
    lists.all(
      "SELECT content FROM lists WHERE title = ? AND autor = ?",
      [listName + ` ${JSON.stringify(username)}`, JSON.stringify(username)],
      (err, rows) => {
        if (err) {
          console.error(err.message);
          res.status(500).send("An error occurred while fetching the list.");
          return;
        }
        if (rows.length === 0) {
          console.log("No matching records found.");
          res.status(404).send("List not found.");
          return;
        }
        const contentArray = rows.map((row) => row.content);
        res.status(200).send(contentArray);
      }
    );
  }
});

app.put("/savelist", (req, res) => {
  const listName = req.body.chosenList;
  username = req.body.user;
  if (username == "admin") {
    if (req.body.content === undefined) {
      res.status(400).send("Content is undefined.");
      return;
    }
    const listContent = JSON.parse(req.body.content);
    if (!listName || !listContent || !Array.isArray(listContent)) {
      res
        .status(400)
        .send(
          "List name and content are required, and content must be an array."
        );
      return;
    }
    const contentString = listContent.join(", ");
    lists.run(
      "UPDATE lists SET content = ? WHERE title = ?",
      [contentString, listName],
      (err) => {
        if (err) {
          console.error(err.message);
          res.status(500).send("An error occurred while updating the list.");
          return;
        }
        res.status(200).send("List updated successfully.");
      }
    );
  } else {
    if (req.body.content === undefined) {
      res.status(400).send("Content is undefined.");
      return;
    }
    const listContent = JSON.parse(req.body.content);
    if (!listName || !listContent || !Array.isArray(listContent)) {
      res
        .status(400)
        .send(
          "List name and content are required, and content must be an array."
        );
      return;
    }
    const contentString = listContent.join(", ");
    lists.run(
      "UPDATE lists SET content = ? WHERE title = ? AND autor = ?",
      [
        contentString,
        listName + ` ${JSON.stringify(username)}`,
        JSON.stringify(username),
      ],
      (err) => {
        if (err) {
          console.error(err.message);
          res.status(500).send("An error occurred while updating the list.");
          return;
        }
        res.status(200).send("List updated successfully.");
      }
    );
  }
});

app.post("/lists", (req, res) => {
  const user = req.body.user;
  if (!user) {
    res.status(400).send("User is required.");
    return;
  }
  if (user === "admin") {
    path.join(__dirname, "lists");
    lists.all("SELECT title FROM lists", [], (err, rows) => {
      if (err) {
        console.error(err.message);
        return;
      }
      const listNames = rows.map((row) => row.title);
      res.status(200).send(listNames);
    });
  } else {
    path.join(__dirname, "lists");
    lists.all(
      "SELECT title FROM lists WHERE autor = ?",
      [JSON.stringify(user)],
      (err, rows) => {
        if (err) {
          console.error(err.message);
          return;
        }
        const listNames = rows.map((row) => {
          const title = row.title.replace(` ${JSON.stringify(user)}`, "");
          return title;
        });
        res.status(200).send(listNames);
      }
    );
  }
});

app.post("/newlist", (req, res) => {
  const listName = req.body.listName;
  const user = req.body.user;
  if (!listName) {
    res.status(400).send("List name is required.");
    return;
  }
  lists.run(
    "INSERT INTO lists (autor, title, content) VALUES (?, ?, ?)",
    [JSON.stringify(user), listName + " " + JSON.stringify(user), ""],
    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).send("An error occurred while creating the list.");
        return;
      }
      res.status(200).send("List created successfully.");
      console.log("List created successfully.");
    }
  );
});

app.delete("/deletelist", (req, res) => {
  const listName = req.body.chosenList;
  const user = req.body.user;
  if (!listName) {
    res.status(400).send("List name is required.");
    return;
  }
  if (user == "admin") {
    lists.run("DELETE FROM lists WHERE title = ?", [listName], (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).send("An error occurred while deleting the list.");
        return;
      }
      res.status(200).send("List deleted successfully.");
      console.log("List deleted successfully.");
    });
  } else {
    lists.run(
      "DELETE FROM lists WHERE title = ? AND autor = ?",
      [listName + ` ${JSON.stringify(user)}`, JSON.stringify(user)],
      (err) => {
        if (err) {
          console.error(err.message);
          res.status(500).send("An error occurred while deleting the list.");
          return;
        }
        res.status(200).send("List deleted successfully.");
        console.log("List deleted successfully.");
      }
    );
  }
});

app.listen(PORT, () => console.log(`online on http://localhost:${PORT}`));
