import { Router } from "express";

const router = Router();

import { UserController, AuthController } from "@controllers";

import AuthM from "../middlewares/auth.middleware.ts";

router.get("/api/users", UserController.list);
router.get("/api/users/:uid", UserController.get);
router.post("/api/users", UserController.create);
router.put("/api/users/:uid", AuthM, UserController.update);
router.delete("/api/users/:uid", AuthM, UserController.delete);

router.get("/api/auth", AuthController.getSession);
router.post("/api/auth/create", AuthController.createSession);
router.get("/api/auth/signout/:uid", AuthController.signOut);

export default router;
