"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const index_1 = require("./config/index");
const appError_1 = __importDefault(require("./utils/appError"));
const app_route_1 = __importDefault(require("./routes/app.route"));
const booking_route_1 = __importDefault(require("./routes/booking.route"));
const contact_route_1 = __importDefault(require("./routes/contact.route"));
const enquiry_route_1 = __importDefault(require("./routes/enquiry.route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const corsOptions = {
    origin: ["http://localhost:3000", "https://linkorgnet.com.ng"],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Session configuration
app.use((0, express_session_1.default)({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: index_1.store,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 // 1 hour
    }
}));
// Routes
app.use("/api/v1", app_route_1.default);
app.use("/api/v1/bookings", booking_route_1.default);
app.use("/api/v1/contacts", contact_route_1.default);
app.use("/api/v1/enquries", enquiry_route_1.default);
app.all("*", (req, res, next) => {
    next(new appError_1.default(`The route ${req.originalUrl} with the ${req.method} method does not exist on this server! 💨`, 404));
});
// Global error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json(Object.assign({ status: "error", message: err.message }, (process.env.NODE_ENV === 'development' && { stack: err.stack })));
});
index_1.db.once("open", () => {
    console.log("Connected to MongoDB");
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
index_1.db.on("error", console.error.bind(console, "MongoDB Connection Error:"));
exports.default = app;
