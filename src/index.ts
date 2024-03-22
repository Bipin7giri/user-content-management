import express, { type Request, type Response } from "express";
import RouteRouter from "./api/api";
import { databaseInit } from "./database/database.connection";
import cors from "cors";
databaseInit();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.get("/", (req: Request, res: Response) => {
  // pusher.triggerEvent();
  return res.status(200).json({
    message: "server is running fine",
  });
});
app.use("/api/v1", RouteRouter);

app.listen(8000, () => {
  console.log("server listening on port " + 8000);
});
console.log("connected to Database");
