# ExpressMWLogger
<h3>EXPRESS MIDDLEWARE For managing users login</h3>
<h5>NOTE:</h5>
<p>
The validUsers.json file contains the user data
(by default, user1 password is user1, and user2 password
is user2).
Passwords are hashed with md5
</p>
<h5>HOW TO USE:</h5>
<p>On the startup site...</p>
<ol>
    <li>Require it like this...<br />
        const logger = require(""); //Insert logger.js path
    </li>
    <li>
        Then use it like this...<br />
        app.use(logger)
    </li>
    <li>
        You shall modify validUserData in the validUsers.json 
        file declared on the constant 'JSONPathValidUsers', and
        add or delete users of your choice
    </li>
</ol>
