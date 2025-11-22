@echo off
echo Initializing cEd Backend Structure...

REM Create folders
mkdir config
mkdir controllers
mkdir models
mkdir routes

REM Create .env
echo PORT=3001> .env
echo DB_HOST=localhost>> .env
echo DB_USER=postgres>> .env
echo DB_PASS=yourpassword>> .env
echo DB_NAME=ced>> .env
echo JWT_SECRET=supersecretkey123>> .env

REM Create server.js
(
echo import express from "express";
echo import cors from "cors";
echo import cookieParser from "cookie-parser";
echo import dotenv from "dotenv";
echo import authRoutes from "./routes/auth.js";
echo import { sequelize } from "./config/db.js";
echo.
echo dotenv.config();
echo const app = express();
echo.
echo app.use(cors^(^{^}^));
echo app.use(express.json());
echo app.use(cookieParser^(^)^);
echo.
echo app.use("/api/auth", authRoutes);
echo.
echo const PORT = process.env.PORT ^|^| 3001;
echo.
echo async function start^(^) {
echo   try {
echo     await sequelize.authenticate^(^);
echo     console.log("DB connected");
echo     await sequelize.sync^(^);
echo     console.log("DB synced");
echo     app.listen(PORT, ^(^) =^> console.log("Backend running on port " + PORT));
echo   } catch (err) {
echo     console.error("Startup error:", err);
echo   }
echo }
echo start^(^);
) > server.js

REM Create config/db.js
(
echo import { Sequelize } from "sequelize";
echo.
echo export const sequelize = new Sequelize(
echo   process.env.DB_NAME,
echo   process.env.DB_USER,
echo   process.env.DB_PASS,
echo   {
echo     host: process.env.DB_HOST,
echo     dialect: "postgres",
echo     logging: false
echo   }
echo );
) > config/db.js

REM Create models/User.js
(
echo import { DataTypes } from "sequelize";
echo import { sequelize } from "../config/db.js";
echo.
echo const User = sequelize.define("User", {
echo   id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
echo   fullName: { type: DataTypes.STRING, allowNull: false },
echo   email: { type: DataTypes.STRING, unique: true, allowNull: false },
echo   passwordHash: { type: DataTypes.STRING, allowNull: false }
echo });
echo.
echo export default User;
) > models/User.js

REM Create controllers/authController.js
(
echo import bcrypt from "bcrypt";
echo import jwt from "jsonwebtoken";
echo import User from "../models/User.js";
echo.
echo export const register = async (req, res) =^> {
echo   try {
echo     const { fullName, email, password } = req.body;
echo     const exists = await User.findOne({ where: { email } });
echo     if (exists) return res.status(400).json({ error: "User exists" });
echo.
echo     const hash = await bcrypt.hash(password, 10);
echo.
echo     const user = await User.create({
echo       fullName,
echo       email,
echo       passwordHash: hash,
echo     });
echo.
echo     return res.json({ success: true, user });
echo   } catch {
echo     return res.status(500).json({ error: "Server error" });
echo   }
echo };
echo.
echo export const login = async (req, res) =^> {
echo   try {
echo     const { email, password } = req.body;
echo     const user = await User.findOne({ where: { email } });
echo     if (!user) return res.status(400).json({ error: "Invalid credentials" });
echo.
echo     const match = await bcrypt.compare(password, user.passwordHash);
echo     if (!match) return res.status(400).json({ error: "Invalid credentials" });
echo.
echo     const token = jwt.sign(
echo       { id: user.id, email: user.email },
echo       process.env.JWT_SECRET,
echo       { expiresIn: "7d" }
echo     );
echo.
echo     res.cookie("ced_token", token, {
echo       httpOnly: true,
echo       maxAge: 7 * 24 * 60 * 60 * 1000,
echo     });
echo.
echo     return res.json({ success: true, token });
echo   } catch {
echo     return res.status(500).json({ error: "Server error" });
echo   }
echo };
) > controllers/authController.js

REM Create routes/auth.js
(
echo import express from "express";
echo import { register, login } from "../controllers/authController.js";
echo.
echo const router = express.Router();
echo router.post("/register", register);
echo router.post("/login", login);
echo.
echo export default router;
) > routes/auth.js

REM Update package.json scripts
powershell -Command "(Get-Content package.json) -replace '\"scripts\": {[^}]*}', '\"scripts\": {\"dev\": \"nodemon server.js\"}' | Set-Content package.json"

echo Backend setup complete.
pause
