import express, { Application, NextFunction, Request, Response } from "express";
import { SalesforceRouter } from "./routes/SalesforceRouter";
import { UAEPassRouter } from "./routes/UAEPassRouter";
import bodyParser from "body-parser";
import cors from "cors";
import {configDotEnv} from "./config/index"


interface CustomError extends Error {
  status?: number;
}

const app: Application = express();
configDotEnv();

// Allow all origin
app.use(cors());

// Body parsing Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// All Endpoints
app.use("/api/v1", [SalesforceRouter, UAEPassRouter]);

// app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
//   return res.status(err.status || 500).json({
//     success: false,
//     message: err.message || 'Internal Server Error',
//     stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
//   });
// });

// app.use((req: Request, res: Response) => {
//   res.status(404).json({
//     success: false,
//     message: 'Resource not found',
//   });
// });

app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
    if(err) {
      console.log("Error" + err)
    }
    next()
});

try {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
  });
} catch (error: any) {
  console.log(`Error occurred: ${error.message}`);
}
