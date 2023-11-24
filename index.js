const express = require('express');
const mongoose = require('mongoose');
const dbconfig = require('./config/db.config');

const auth = require('./middleware/auth');
const errors = require('./middleware/errors');

const {unless} = require('express-unless');

const app = express();

mongoose.Promise = global.Promise;
mongoose
.connect(dbconfig.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(
    ()=>{
        console.log("Database Connected");
    },
    (error)=>{
        console.log("Database can't be connected: " + error);
    }
);

auth.authenticateToken.unless = unless;
app.use(
    auth.authenticateToken.unless({
        path: [
            {url: "/users/login", methods: ["POST"]},
            {url: "/users/register", methods: ["POST"]},
        ],
    })
);

// console.log(typeof auth.authenticateToken.unless);

app.use(express.json());

app.use("/users",require("./routes/users.routes"));

app.use(errors.errorHandler);

app.listen(process.env.port || 4000, function(){
    console.log("Ready to go!");
})