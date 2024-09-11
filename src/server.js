import express from "express";
import routes from "./routes/index"

const app = express();

app.use(express.json())
app.use(routes)

const PORT = 3001;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


// localhost:3001
// localhost:3001/users
// localhost:3001/products?key=value&key2=value2

