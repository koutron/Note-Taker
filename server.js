// Use npx nodemon server.js to start nodemon

// Dependencies
const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
const PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Anything in the public directory can be requested (i.e. an HTML file requesting a CSS file)
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
    const newNote = {title: req.body.title, text: req.body.text};
    fs.readFile("./db/db.json", "utf8", function (err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        data.push(newNote);
        data = assignIds(data);
        data = JSON.stringify(data);
        fs.writeFile("./db/db.json", data, function(err){
            if(err) throw err;
        });
    });
    res.json(newNote);
});

app.delete("/api/notes/:id", function(req, res){
    const deleteId = req.params.id;
    console.log(deleteId);
    fs.readFile("./db/db.json", "utf8", function (err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        data.splice(deleteId, 1);
        data = assignIds(data);
        res.json(data);
        data = JSON.stringify(data);
        fs.writeFile("./db/db.json", data, function(err){
            if(err) throw err;
        });
    });
});

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});

function assignIds(data){
    let id=0;
    data.forEach(note => {
        note.id=id;
        id++;
    });
    console.log(data);
    return data;
}