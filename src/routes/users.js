import {Router} from "express";
import {checkSchema, matchedData, query, validationResult} from "express-validator";
import {mockUsers} from "../utils/constants";
import {createUserValidationSchema} from "../utils/validationSchemas";
import {resolveIndexByUserId} from "../utils/middlewares";


const router = Router()

router.get('/api/users',
    query("filter")
        .isString()
        .notEmpty()
        .withMessage("Must not be empty")
        .isLength({min: 3, max: 10})
        .withMessage("Must be at least 3-10 characters"),
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
    })

router.post(
    '/api/users',
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
    }
)

router.get('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const {findUserIndex} = req;
    const findUser = mockUsers[findUserIndex]
    if (!findUser) return res.sendStatus(404) // if not found return the response
    return res.send(findUser) // if found return the response in user object
})

router.put('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const {body, findUserIndex} = req;
    mockUsers[findUserIndex] = {id: mockUsers[findUserIndex].id, ...body}
    return res.sendStatus(200)
})

router.patch('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const {body, findUserIndex} = req;
    mockUsers[findUserIndex] = {...mockUsers[findUserIndex], ...body}
    return res.sendStatus(200);
})

router.delete('/api/users/:id', (req, res) => {
    const {params: {id}} = req;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return res.sendStatus(400);

    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId)
    if (findUserIndex === -1) return res.sendStatus(404);
    mockUsers.splice(findUserIndex, 1)
    return res.sendStatus(200);
})

export default router;