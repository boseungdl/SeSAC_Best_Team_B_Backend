import express, { Router } from "express";
import passport from "passport";

const router: Router = express.Router();

router.get("/kakao", passport.authenticate("kakao"));
router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

export default router;
