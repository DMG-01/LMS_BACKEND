"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const connectDb_1 = __importDefault(require("./connectDb"));
const service_1 = __importDefault(require("./routes/service"));
const registerRoute_1 = __importDefault(require("./routes/registerRoute"));
const staffs_1 = __importDefault(require("./routes//staffs"));
const dashRoutes_1 = __importDefault(require("./routes/dashRoutes"));
const referralRoute_1 = __importDefault(require("./routes/referralRoute"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: `http://localhost:5173`,
    credentials: true
}));
app.use(service_1.default);
app.use(registerRoute_1.default);
app.use(dashRoutes_1.default);
app.use(referralRoute_1.default);
app.use(authRoutes_1.default);
app.use(staffs_1.default);
app.get("/", (req, res) => {
    res.send("Hello from TypeScript + Express!");
});
app.listen(PORT, async () => {
    await connectDb_1.default.authenticate();
    await connectDb_1.default.sync({ alter: true });
    console.log(`Server is running on http://localhost:${PORT}`);
});
exports.default = app;
