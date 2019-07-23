# ExpressMWLogger
NodeJS Express Login Middleware with external file for editing users data (with hashed passwords)
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
    3 - You shall modify validUserData in the validUsers.json 
        file declared on the constant 'JSONPathValidUsers', and
        add or delete users of your choice
