import express, { NextFunction, Request, Response } from "express";
import rootRouter from "./routes";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { config } from "dotenv";

config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Utility function for cache control headers
const setNoCacheHeaders = (res: Response) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
};

// Redirect root to /app
app.get("/", (req: Request, res: Response) => {
  console.log("Root route hit, redirecting to /app");
  res.redirect("/app");
});

// Serve static files for the frontend
const frontendPath = path.join(process.cwd(), "frontend/dist");
app.use("/app", express.static(frontendPath, { maxAge: 0 }));
app.get("/app/*", (req: Request, res: Response) => {
  setNoCacheHeaders(res);
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Serve static files for the admin panel
const adminPath = path.join(process.cwd(), "admin/dist");
app.use("/admin", express.static(adminPath, { maxAge: 0 }));
app.get("/admin/*", (req: Request, res: Response) => {
  setNoCacheHeaders(res);
  res.sendFile(path.join(adminPath, "index.html"));
});

// API routes
app.use("/api/v1", rootRouter);

// Fallback for undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;


// import express, { NextFunction, Request, Response } from "express";
// import bodyParser from "body-parser";
// import cors from "cors";
// import path from "path";
// import rootRouter from "./routes";
// import { config } from "dotenv";

// config();

// const app = express();

// app.use(cors());
// app.use(bodyParser.json());

// app.get("/", (req: Request, res: Response) => {
//   res.redirect("/app");
// });

// app.use("/app", express.static(path.join(__dirname, "../../frontend/dist"), { maxAge: 0 }));
// app.get("/app/*", (req: Request, res: Response) => {
//   res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
//   res.sendFile(path.join(__dirname, "../../frontend/dist", "index.html"));
// });

// app.use("/admin", express.static(path.join(__dirname, "../../admin/dist"), { maxAge: 0 }));
// app.get("/admin/*", (req: Request, res: Response) => {
//   res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
//   res.sendFile(path.join(__dirname, "../../admin/dist", "index.html"));
// });

// app.use("/api/v1", rootRouter);

// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   console.error(err.stack);
//   res.status(500).json({ error: "Internal Server Error" });
// });

// export default app;
