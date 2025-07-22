import express from "express";
import dotenv from "dotenv";
import sequelize from "./connectDb"
import serviceRouter from "./routes/service"
import registerRouter from "./routes/registerRoute"
import staffsRouter from "./routes//staffs"
import dashRouter from "./routes/dashRoutes";
import referralRouter from "./routes/referralRoute";
import auth from "./routes/authRoutes"
import cors from "cors"
import cookieParser from "cookie-parser"
import { Sequelize } from "sequelize";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cookieParser())
app.use(cors({
  origin : `http://localhost:5173`, 
  credentials : true
}))
app.use(serviceRouter)
app.use(registerRouter)
app.use(dashRouter)
app.use(referralRouter)
app.use(auth)

app.use(staffsRouter)
app.get("/", (req, res) => {
  res.send("Hello from TypeScript + Express!");
});

app.listen(PORT, async () => {
    await sequelize.authenticate()
    await sequelize.sync({ alter: true })
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app