import express, {request, response} from "express";
import {body, matchedData, query, validationResult, checkSchema} from "express-validator";
import {createUserValidationSchema} from "./utils/validationSchemas";


const app = express();
app.use(express.json())

const loggingMiddleware = (request, response, next) => {
    console.log(`${request.method} ${request.url}`);
    next();
}

const resolveIndexByUserId = (req, res, next) => {
    const {params: {id}} = req;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return res.sendStatus(400);
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId)
    if (findUserIndex === -1) return res.sendStatus(404);
    req.findUserIndex = findUserIndex;
    next();
}

app.use(loggingMiddleware);

const PORT = 3001;

const mockUsers = [{
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
}]

app.get('/', (req, res) => {
    res.status(201).send({msg: 'Hello'});
})

app.get('/api/users', query("filter").isString().notEmpty().isLength({min: 3, max: 10}),
    (req, res) => {
        const result = validationResult(req)
        console.log(result)
        console.log(req.query);
        // Line is used correctly to extract 'filter' and 'value' from 'req.query'.
        const {filter, value} = req.query;

        // when filter and value are undefined
        if (!filter && !value) return res.status(200).send(mockUsers);

        if (filter && value) return res.send(// match the first letter of the specified filter field with the value ignoring case
            mockUsers.filter((user) => user[filter]?.toLowerCase()
                .startsWith(value.toLowerCase())));

        // In case only one of filter or value is provided
        return res.status(400).send({error: 'Invalid query parameters'});
    });

app.post('/api/users',
    checkSchema(createUserValidationSchema),
    (req, res) => {
        const result = validationResult(req)
        console.log(result)

        if (!result.isEmpty())
            return res.status(400).send({errors: result.array()})

        const data = matchedData(req)
        const newUser = {id: mockUsers[mockUsers.length - 1].id + 1, ...data}
        mockUsers.push(newUser)
        return res.status(201).send(newUser);
    })

app.get('/api/products', (req, res) => {
    res.status(202).send([{id: 111, name: 'Beef', price: 750}, {id: 112, name: 'Chicken', price: 220}, {
        id: 113,
        name: 'Duck',
        price: 750
    },])
})

app.get('/api/users/:id', resolveIndexByUserId, (req, res) => {
    // console.log(req.params); // show the request id in console
    // const parsedId = parseInt(req.params.id) // convert the request id to a number
    // console.log(parsedId) // show the request id
    // if (isNaN(parsedId)) return res.status(400).send({msg: "Bad Request. Invalid ID"}) // show the error message
    //
    // const findUser = mockUsers.find((user) => user.id === parsedId) // find the user
    const {findUserIndex} = req;
    const findUser = mockUsers[findUserIndex]
    if (!findUser) return res.sendStatus(404) // if not found return the response
    return res.send(findUser) // if found return the response in user object
})

app.put('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const {body, findUserIndex} = req;
    mockUsers[findUserIndex] = {id: mockUsers[findUserIndex].id, ...body}
    return res.sendStatus(200)
})

app.patch('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const {body, findUserIndex} = req;
    mockUsers[findUserIndex] = {...mockUsers[findUserIndex], ...body}
    return res.sendStatus(200);
})

app.delete('/api/users/:id', (req, res) => {
    const {params: {id}} = req;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return res.sendStatus(400);

    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId)
    if (findUserIndex === -1) return res.sendStatus(404);
    mockUsers.splice(findUserIndex, 1)
    return res.sendStatus(200);
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


// localhost:3001
// localhost:3001/users
// localhost:3001/products?key=value&key2=value2

