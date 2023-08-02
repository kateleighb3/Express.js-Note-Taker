const PORT = process.env.PORT || 3001; // process.env object in node.js gives access to the system's environment variables-
//which are values that can be set outside of the application and are accessible by the running process. Here, the code is looking
//for the envirnment variable named 'PORT'. If the left operand (process.env.PORT )is falsy or not defined, the 'PORT' constant 
// will be set to a default value (3001). If the the left operand is truthy, the operator will return the value of the 
//left operand and the 'PORT' constant will be set to the value of 'process.env.PORT'.
const path = require('path'); //importing path module
const fs = require('fs'); //importing fs module

const express = require('express'); // importing express module
const app = express(); // the main app

const theNotes = require('./db/db.json');

//these lines set up middleware for the Express application:
app.use(express.urlencoded({extended: true}));//middleware used to parse incoming URL-encoded form data; allows you to access
//data submitted from HTML forms via the 'req.body' object
app.use(express.json()); // middleware used to parse incoming JSON data; allows you to access JSON data sent in the request body
//via the 'req.body' object
app.use(express.static('public')); //middleward serves static files (CSS, JavaScript, images) from the 'public' directory. It
//makes the public directory a static content directory accessible to clients.

app.get('/api/notes', (req, res) => { //a route handler that defines a GET route at /api/notes. When a request is made to this
    //endpoint, ....
    res.json(theNotes.slice(1)); //...it responds with the 'allNotes' array, excluding the first element [0] using 'slice(1)'.
});

app.get('/notes', (req, res) => { //This route handler defines a GET route at '/notes'. 
    //When a request is made to '/notes', it responds with the 'notes.html' file located in the 'public' directory.
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notesArray }, null, 2)
    );
    return note;
}

app.post('/api/notes', (req, res) => {
    const newNote = createNewNote(req.body, theNotes);
    res.json(newNote);
});

function deleteNote(id, notes) {
    let notesArray = notes.filter(el => {
        if (el.id == id) {
            return false
        } else {
            return true
        }
    });

let index = 0;
notesArray.forEach(note => {
    note.id = index;
    index +=1;
});

fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify({ notesArray }, null, 2)
);
return notesArray;
};

app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, theNotes);
    res.json(true);
});

app.get('*', (req, res) => { //This route handler is a catch-all route that responds to any other GET requests 
    //that don't match the defined routes. It serves the 'index.html' file as the response.
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});