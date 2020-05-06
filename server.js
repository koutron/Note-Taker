// Dependencies
const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
const PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function (req, res) {
    fs.readFile("./db/db.json", "utf8", function (err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        res.json(data);
    });
});

app.post("/api/notes", function(req, res){
    console.log(req.body);
    const newNote = {title: req.body.title, text: req.body.text};
    console.log("newNote is " + newNote);
    fs.readFile("./db/db.json", "utf8", function (err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        data.push(newNote);
        data = JSON.stringify(data);
        fs.writeFile("./db/db.json", data, function(err){
            if(err) throw err;
        });
    });
    res.json(newNote);
});

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});