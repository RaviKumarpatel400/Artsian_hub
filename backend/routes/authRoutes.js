// import express from "express";
// import { signup, login } from "../controllers/authController.js";

// const router = express.Router();

// router.post("/signup", signup);
// router.post("/login", login);

// export default router;


import express from "express";
// instead of importing register
import { signup, login } from "../controllers/authController.js";
const router = express.Router();
// use signup in your route
router.post("/signup", signup);
router.post("/login", login);



export default router;
