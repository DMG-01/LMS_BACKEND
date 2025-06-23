import express from "express";
import dotenv from "dotenv";
import sequelize from "./connectDb"
import serviceRouter from "./routes/service"
import registerRouter from "./routes/register"
import { register } from "module";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(serviceRouter)
app.use(registerRouter)

app.get("/", (req, res) => {
  res.send("Hello from TypeScript + Express!");
});

app.listen(PORT, async () => {
    await sequelize.authenticate()
    sequelize.sync({ alter: true })
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app