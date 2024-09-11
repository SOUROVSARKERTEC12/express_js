import {Router} from "express";
import userRouter from './users'
import productsRouter from "./products";

const router = Router()

router.use(userRouter)
router.use(productsRouter)

export default router