import { Router } from "express";
import { LoginUseCase } from "../../domain/use-cases/login.use-case.js";
import { RegisterUserUseCase } from "../../domain/use-cases/register-user.use-case.js";
import { JwtEncrypter } from "../../infrastructure/auth/jwt-encrypter.js";
import { BcryptHasher } from "../../infrastructure/cryptography/bcrypt-hasher.js";
import { PrismaUserRepository } from "../../infrastructure/prisma/prisma-user.repository.js";
import { LoginController } from "../../presentation/controllers/login.controller.js";
import { RegisterController } from "../../presentation/controllers/register.controller.js";
import { adaptRoute } from "../adapters/express-route-adapter.js";

const router = Router();

// Factory Simple (Composition Root)
const userRepository = new PrismaUserRepository();
const hasher = new BcryptHasher();
const encrypter = new JwtEncrypter(process.env.JWT_SECRET || "secret");

const registerUseCase = new RegisterUserUseCase(userRepository, hasher);
const loginUseCase = new LoginUseCase(userRepository, hasher, encrypter);

const registerController = new RegisterController(registerUseCase);
const loginController = new LoginController(loginUseCase);

router.post("/register", adaptRoute(registerController));
router.post("/login", adaptRoute(loginController));

export default router;
