import express, { Application } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { db, store } from "./config/index"; 
import AppError from "./utils/appError";
import appRoutes from "./routes/app.route";
import adminRoutes from "./routes/admin.route";
import bookingRoutes from "./routes/booking.route";
import contactRoutes from "./routes/contact.route";
import enquiryRoutes from "./routes/enquiry.route";
import emailRoutes from "./routes/email.route";
import oauthRouter from './routes/oauthRoutes';


dotenv.config();
const app: Application = express();

const corsOptions = {
  origin: ["http://localhost:3000", "https://linkorgnet.com.ng", "https://www.linkorgnet.com.ng"],
  credentials: true,
};


app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Session configuration
app.use(session({
  secret: process.env.SECRET_KEY!,
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));




app.use(helmet());
app.use(rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // limit to 10 requests per IP
}));


// Routes
app.use("/api/v1", appRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/contacts", contactRoutes);
app.use("/api/v1/enquiries", enquiryRoutes); 
app.use("/api/v1/email", emailRoutes);
app.use('/api/v1/oauth', oauthRouter);



app.all("*", (req, res, next) => {
  next(new AppError(`The route ${req.originalUrl} with the ${req.method} method does not exist on this server! 💨`, 404));
});


// Global error handling middleware
app.use((err: AppError, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: "error",
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

db.once("open", () => {
  console.log("Connected to MongoDB");

  const PORT: number | string = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

db.on("error", console.error.bind(console, "MongoDB Connection Error:"));

export default app;
