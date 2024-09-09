import express, {request, response} from "express";
import {array, z} from "zod";
import {createUserValidationSchema} from "./utils/validationSchemasZod";

const app = express();
app.use(express.json());

const loggingMiddleware = (request, response, next) => {
    console.log(`${request.method} ${request.url}`)
    next()
}

const resolveIndexByUserId = (req, res, next) => {
    const {params: {id}} = req;
    const parseId = parseInt(id)
    if (isNaN(parseId)) return res.sendStatus(400)
    const findUserIndex = Users1.findIndex((user) => user.id === parseId)
    if (findUserIndex === -1) return res.sendStatus(404)
    req.findUserIndex = findUserIndex
    next()
}

app.use(loggingMiddleware)

const Users1 = [{
    id: 1, username: "anson", displayName: "Anson"
}, {
    id: 2, username: "Moyra", displayName: "Redan"
}, {
    id: 3, username: "Hestia", displayName: "Dur"
}, {
    id: 4, username: "Johnnie", displayName: "Broomhead"
}, {
    id: 5, username: "Reinold", displayName: "Corder"
}, {
    id: 6, username: "Shaylynn", displayName: "Kaasmann"
}, {
    id: 7, username: "Nappy", displayName: "Nrayton"
}, {
    id: 8, username: "Doti", displayName: "Finessy"
}, {
    id: 9, username: "Odie", displayName: "McCarty"
}, {
    id: 10, username: "Rriocard", displayName: "Vereker"
}];

const querySchema = z.object({
    filter: z.string().min(3).max(10),
    value: z.string().optional()
})

const userSchema = z.object({
    username: z.string().optional(),
    displayName: z.string().optional()
})

app.get('/', (req, res) => {
    res.status(201).send({message: 'Hello'});
});

app.get('/api/users', (req, res) => {
    const parseResult = querySchema.safeParse(req.query)

    if (!parseResult.success) {
        return res.status(400).send({error: "invalid query parameters"});
    }

    const {filter, value} = parseResult.data;

    if (!filter && !value) return res.status(200).send(Users1)

    if (filter && value) return res.send(
        Users1.filter((user) => user[filter]?.toLowerCase()
            .startsWith(value.toLowerCase()))
    )

    return res.status(200).send({error: "Invalid query parameters"})
})

app.post('/api/users', (req, res) => {
    const parseResult = createUserValidationSchema.safeParse(req.body);

    // Handle validation failure and return detailed error messages
    if (!parseResult.success) {
        return res.status(400).send({
            error: 'Invalid user data in POST request',
            details: parseResult.error.errors// Send Zod validation error messages
        });
    }

    const {username, displayName} = parseResult.data;

    const newUser = {id: Users1[Users1.length - 1].id + 1, username, displayName};
    Users1.push(newUser);
    return res.status(201).send(newUser);
});

app.get('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const {findUserIndex} = req;
    const findUser = Users1[findUserIndex]
    if (!findUser) return res.sendStatus(404)
    return res.send(findUser)
})

app.put('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const parseResult = userSchema.safeParse(req.body);

    if (!parseResult.success) {
        return res.status(400).send({error: 'Invalid user data'});
    }

    const {findUserIndex} = req;
    Users1[findUserIndex] = {id: Users1[findUserIndex].id, ...parseResult.data};
    return res.sendStatus(200);
});

app.patch('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const parseResult = userSchema.safeParse(req.body)

    if (!parseResult.success) {
        return res.status(400).send({error: 'Invalid user data'})
    }

    const {findUserIndex} = req;
    Users1[findUserIndex] = {...Users1[findUserIndex], ...parseResult.data}
    return res.sendStatus(200)
})

app.delete('/api/users/:id', (req, res) => {
    const {params: {id}} = req
    const parsedId = parseInt(id)
    if (isNaN(parsedId)) return res.sendStatus(400)

    const findUserIndex = Users1.findIndex((user) => user.id === parsedId)
    if (findUserIndex === -1) return res.sendStatus(404)
    Users1.splice(findUserIndex, 1)
    return res.sendStatus(200)
})

const PORT = 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
