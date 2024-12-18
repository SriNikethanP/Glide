import express from "express";

const router = express.Router();

router.get("/signup", signup);
router.get("/login", login);
router.get("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);

export default router;
