var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var fs = require("fs");
var multer = require("multer");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
// This is how the project wanted us to implement multer, but it isn't working when I run the server file. ChatGPT has provided a fix
// app.use(multer({ dest: "/tmp" }));

// ChatGPT implementation fix:
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "/tmp/");
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: storage });

// end ChatGPT implementation fix

// Delving into things I am struggling to comprehend
app.use("/index.html", (req, res) => {
    res.sendFile(__dirname + "/" + "index.html");
});

app.get("/process_get", (req, res) => {
    // Prepare output in JSON format
    response = {
        first_name:req.query.first_name,
        last_name:req.query.last_name
    };
    console.log(response);
    res.end(JSON.stringify(response));
});
// end delv one

// Delving into struggle part two
var urlencodedParser = bodyParser.urlencoded({ extended: false});
app.post("/process_post", urlencodedParser, (req, res) => {
    // PREPARE OUTPUT IN JSON FORMAT!!!
    response = {
        first_name:req.body.first_name,
        last_name:req.body.last_name
    };
    console.log(response);
    res.end(JSON.stringify(response));
});


// This responds with a "Hello World GET" on the homepage
app.get("/", (req, res) =>  {
    console.log("Got a GET request for the")
    res.send("Hello World GET");
});

// This responds a POST request for the homepage
app.post("/", (req, res) =>  {
    console.log("Got a POST request for the")
    res.send("Hello World POST");
});

// This responds a DELETE request for the /del_user page.
app.delete("/del_user", (req, res) =>  {
    console.log("Got a DELETE request for /del_user")
    res.send("Hello DELETE");
});

// This responds a GET request for the /list_user page.
app.get("/list_user", (req, res) =>  {
    console.log("Got a GET request for /list_user")
    res.send("Page Listing");
});

// This responds a GET request for abcd, abxcd, ab123cd, and so on
app.get("/ab*cd", (req, res) =>  {
    console.log("Got a GET request for /ab*cd")
    res.send("Page Pattern Match");
});

// Writing logic for file uploads
app.get("/index.html", (req, res) => {
    res.sendFile( __dirname + '/' + "index.html");
});

// ChatGPT added another parameter in the app.post below, being the "upload.single("file")"
app.post("/file_upload", upload.single("file"), (req, res) => {
    console.log(req.file.originalname);
    console.log(req.file.path);
    console.log(req.file.mimetype);

    var file = __dirname + '/' + req.file.originalname;

    fs.readFile( req.file.path, (err, data) => {
        fs.writeFile(file, data, (err) => {
            if( err ) {
                console.log ( err );
                res.status(500).send("Inernal Server Error");
            } else {
                response = {
                    message: "File uploaded successfully",
                    filename:req.file.originalname
                };
            }
            console.log( response );
            res.end( JSON.stringify( response ));
        })
    } )
})



var server = app.listen(8081, () => {
    var host = server.address().address;
    var port = server.address().port;

    console.log(`Example app listening at http://${host}:${port}`);
});