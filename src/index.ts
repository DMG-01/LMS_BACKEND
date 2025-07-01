import express from "express";
import dotenv from "dotenv";
import sequelize from "./connectDb"
import serviceRouter from "./routes/service"
import registerRouter from "./routes/registerRoute"
import staffsRouter from "./routes//staffs"
import { Sequelize } from "sequelize";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(serviceRouter)
app.use(registerRouter)

app.use(staffsRouter)
app.get("/", (req, res) => {
  res.send("Hello from TypeScript + Express!");
});

app.listen(PORT, async () => {
    await sequelize.authenticate()
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app