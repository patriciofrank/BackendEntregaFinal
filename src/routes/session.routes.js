import { Router } from "express";
import passport from "passport";
import { destroySession } from "../controllers/session.controller.js";
import { passportCall, authorization } from "../utils/messageErrors.js";
import { createUserController } from "../controllers/user.controller.js";

const routerSession = Router()

routerSession.post("/register", passport.authenticate('register'), createUserController);
routerSession.post("/login", passport.authenticate('login'), (req, res) => {
  const token = req.user && req.user.accessToken;
  console.log(req.user);
  if (token) {
      res.cookie('jwtCookie', token, { httpOnly: true, secure: true });
      res.status(200).json({ message: "Login successful", payload: req.user });
  } else {
      res.status(401).json({ message: "Unauthorized" });
  }
})
routerSession.get("/logout", destroySession)

routerSession.get("/current", passportCall('jwt'), authorization('Admin'), (req, res) => {
  res.send(req.user)
})

export default routerSession