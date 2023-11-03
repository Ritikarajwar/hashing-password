import express from "express";
import cors from "cors";
import connection, { dbName } from "./connection.js";
import bcrypt from "bcrypt";

const app = express();
const port = 8052;
let db;

app.use(express.json());
app.use(cors({ origin: "http://127.0.0.1:5500" }));


app.options("/newentry", (req, res) => {
    res.header("Access-Control-Allow-Methods", "POST")
    res.sendStatus(200)
})



app.post('/newentry', express.json(), async (req, res) => {
    // let information = req.body
    // console.log(information)

    let { name, email, username } = req.body

    let hashedpasscode = await bcrypt.hash(req.body.password, 10)
    let data = db.collection('users').insertOne({ name, email, username, hashedpasscode })

    res.send(JSON.stringify('done'))
})


app.post("/login", async (req, res) => {
    let existinguser = await db.collection('users').find({}).toArray()
    // console.log(req.body.username)
    let name = req.body.username
    // console.log(existinguser)

    let exists = false
    let i
    for ( i = 0; i < existinguser.length - 1; i++) {
        if (existinguser[i].username == name) {
            exists = true

        }
        else{
            res.send(JSON.stringify('user not found'))
        }
    }

    if (exists == true) {
        const checkpassword = await bcrypt.compare(req.body.password, existinguser[i].hashedpasscode)      
        
        
        if(!checkpassword){
            res.send(JSON.stringify('password not matched'))
        }
        else{
            res.send(JSON.stringify('login successful'))
        }

    }


})





connection.then((client) => {
    db = client.db(dbName);
    app.listen(port, () => console.log(port + " started "));
});
