"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const errorHandler_1 = require("./src/middlewares/errorHandler");
const authRoutes_1 = __importDefault(require("./src/routes/authRoutes"));
const categoryRoutes_1 = __importDefault(require("./src/routes/categoryRoutes"));
app.use(bodyParser.json());
app.use(cors_1.default());
dotenv_1.default.config();
const db = process.env.MONGO_URI;
console.log(db);
mongoose_1.default
    .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
    console.log("databse ");
})
    .catch((err) => {
    console.log("Error connecting to the database", err);
});
app.use("/auth", authRoutes_1.default);
app.use("/category", categoryRoutes_1.default);
const PORTNUMBER = parseInt(process.env.PORT) || 5000;
app.use(errorHandler_1.ErrorHandler);
app.listen(PORTNUMBER, () => {
    console.log(`Server is running on ${PORTNUMBER}`);
});
//# sourceMappingURL=server.js.map