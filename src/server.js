import express from "express";
import routes from "./routes/index"
import cookieParser from 'cookie-parser';
import session from "express-session"

const app = express();

app.use(express.json())
app.use(cookieParser("helloworld"))
app.use(session({
    secret: "the dev",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60,
    }
}))
app.use(routes)

app.get('/', (req, res) => {
    // console.log(req.session);
    console.log(req.session.id)
    req.session.visited = true

    res.cookie("hello", "world", {maxAge: 30000, signed: true})
    res.status(201).send({message: "Welcome"})
})

const PORT = 3001;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


// localhost:3001
// localhost:3001/users
// localhost:3001/products?key=value&key2=value2

