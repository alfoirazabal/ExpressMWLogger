/*
    EXPRESS MIDDLEWARE For managing users login

    NOTE:
    The validUsers.json file contains the user data
    (by default, user1 password is user1, and user2 password
    is user2).
    Passwords are hashed with md5

    HOW TO USE:
    On the startup site...
    1 - Require it like this...
        const logger = require(""); //Insert logger.js path
    2 - Then use it like this...
        app.use(logger)
    3 - Then you shall modify validUserData in the validUsers.json 
        file declared on the constant 'JSONPathValidUsers',and
        add or delete users of your choice
*/

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const JSONPathValidUsers = path.join(__dirname, "validUsers.json");

const loginURL = "/login";
const unlogURL = "/unlog";

const staticFiles = []; //Static files to be served on login site (won't check for cookies)
staticFiles['loggerProcessData'] = {
    url: "/loggerProcessV1",
    file: "loggerProcess.js",
    contentType: "text/javascript",
    lastModified: new Date(2019, 07, 23, 18, 09)
};
staticFiles['loggerStylesData'] = {
    url: "/loggerStylesV1",
    file: "logger.css",
    contentType: "text/css",
    lastModified: new Date(2019, 07, 23, 18, 09)
};

/*
CONTENT OF validUserData
each user is an object, like the following:
users must be edited inside validUsers JSON file (JSONPathValidUsers)
{
    uName: THE USER NAME
    pWord: MD5 HASH OF PASSWORD IN LOWERCASE
}
*/

module.exports = (req, res, next) => {  //EXPRESS MIDDLEWARE

    begin();

    function begin(){
        const readFile = () => {
            return new Promise((resolve, reject) => {
                fs.readFile(JSONPathValidUsers, "utf-8", (err, data) => {
                    if(err){
                        reject(`Error while trying to read '${JSONPathValidUsers}': ${err}`);
                    }
                    try{
                        const vudObject = JSON.parse(data);
                        resolve(vudObject);
                    }catch(err2){
                        reject(`Error while parsing user data from '${JSONPathValidUsers}': ${err2}`);
                    }
                });
            });
        }
        readFile().then((validUserData) => {
            const cookies = cookiesParser(req.headers.cookie);  //Parse request cookies to a new object
            switch(req.url){
                case loginURL: login(); break;
                case unlogURL: unlog(); break;
                //If the url matches any of the options below, send the static files
                case staticFiles['loggerProcessData'].url: sendStaticLoginData(staticFiles['loggerProcessData']); break;
                case staticFiles['loggerStylesData'].url: sendStaticLoginData(staticFiles['loggerStylesData']); break;
                default: evalLogin(); break;    //Evaluates whether user and password cookies are set
            }
            function evalLogin(){
                const foundUser = validUserData.find(e => 
                    e.uName === cookies.uName && e.pWord === cookies.pWord);
                const isValid = foundUser !== undefined;
                if(isValid){
                    next(); //Cookies are set, proceed
                }else{
                    res.redirect(loginURL); //Redirect to login URL
                }
            }
            function login(){
                fs.readFile(path.join(__dirname, "logger.ejs"), "utf-8", (err, data) => {
                    if (err){
                        throw err;
                    }else{
                        if(req.method == "POST"){
                            bodyParser(req).then(() => {    //Parse POSTed data
                                if(req.body.username !== undefined && req.body.password !== undefined){
                                    const username = req.body.username;
                                    const hashedPassword = crypto.createHash("md5").update(req.body.password).digest("hex");
                                    const foundUser = validUserData.find(e =>
                                        e.uName === username && e.pWord === hashedPassword);    //Check whether user exists
                                    if(foundUser !== undefined){    //If user exists
                                        //Set cookies on the response and redirect to main page
                                        res.cookie("uName", foundUser.uName);
                                        res.cookie("pWord", foundUser.pWord);
                                        res.redirect("/");
                                    }else{
                                        data = data.replace("<%=MESSAGEDATA%>", 1); //Wrong credentials
                                        res.send(data);
                                    }
                                }else{
                                    data = data.replace("<%=MESSAGEDATA%>", 2); //Bad query
                                    res.send(data);
                                }
                            });
                        }else{
                            data = data.replace("<%=MESSAGEDATA%>", 0); //Get request
                            res.send(data);
                            next();
                        }
                    }
                });
            }
            function unlog(){
                //Unset login cookies and redirect
                res.cookie("uName", "");
                res.cookie("pWord", "");
                res.redirect(loginURL);
            }
            function sendStaticLoginData(fileData){
                fs.readFile(path.join(__dirname, fileData.file), "utf-8", (err, data) => {
                    if(err){
                        throw err;
                    }else{
                        res.contentType(fileData.contentType);
                        res.setHeader('Last-Modified', fileData.lastModified);
                        res.statusCode = 200;
                        res.send(data);
                    }
                });
            }
        })
        .catch((err) => {
            console.error(err);
        });
    }
}

function cookiesParser(cookies){
    //Parse cookies
    if(cookies === undefined) return {};
    const cookiesArr = [];
    const cookiesData = cookies.split("; ");
    cookiesData.forEach(cd => {
        const subdata = cd.split("=");
        cookiesArr[subdata[0]] = subdata[1];
    });
    return cookiesArr;
}

function bodyParser(req){
    //Parse body
    return new Promise((resolve) => {
        let data = '';
        req.on( 'data', function( chunk ) {
            data += chunk;
        });
        req.on( 'end', function() {
            req.rawBody = data;
            parseBodyString(req.rawBody);
            resolve(0);
        });
    });
    function parseBodyString(rawString){
        req.body = {};
        const topData = rawString.split("&");
        topData.forEach(td => {
            const subData = td.split("=");
            req.body[subData[0]] = subData[1];
        });
    }
}