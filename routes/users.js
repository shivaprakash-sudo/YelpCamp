import express from "express";
import passport from "passport";
import {
  signupForm,
  createUser,
  loginForm,
  login,
  logout,
  profile,
} from "../controllers/users.js";

const router = express.Router();

router.route("/signup").get(signupForm).post(createUser);

router
  .route("/login")
  .get(loginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
      keepSessionInfo: true,
    }),
    login
  );

router.get("/logout", logout);

router.get("/profile", profile);

export default router;
