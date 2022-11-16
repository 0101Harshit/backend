import express from "express";
import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel";
import { generateToken } from "../utils";

const userRouter = express.Router();

userRouter.post(
    "/signup",
    expressAsyncHandler(async (req, res) => {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
        });
        const user = await newUser.save();
        res.send({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user),
        });
    })
);

userRouter.post(
    "/signin",
    expressAsyncHandler(async (req, res) => {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                res.send({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    token: generateToken(user),
                });
                return;
            }
        }
        res.status(401).send({ message: "Invalid email or password" });
    })
);

export default userRouter;