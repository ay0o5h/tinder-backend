import * as cors from "cors";
import * as express from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";



const app = express();

const port = process.env.PORT || 5000;


createConnection().then(async connection => {
    app.use(express.json());
    app.use(cors());
    // app.use("/v1", webv1);
    // app.use("/dash/v1", dashv1);
    // app.use(notFound);
    app.listen(port, () => console.log(`Running on ${port}`));


}).catch(error => console.log(error));
