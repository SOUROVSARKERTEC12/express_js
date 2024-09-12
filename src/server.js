import express from "express";
import routes from "./routes/index"
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json())
app.use(cookieParser("helloworld"))
app.use(routes)

app.get('/', (req, res) => {
    res.cookie("hello", "world", {maxAge: 30000, signed: true})
    res.status(201).send({message: "Welcome"})
})

const PORT = 3001;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


// localhost:3001
// localhost:3001/users
// localhost:3001/products?key=value&key2=value2

