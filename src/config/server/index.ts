import fs from "fs";
import https from "https";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import compression from "compression";
import morgan from "morgan";
import path from "path";
import { config } from "../";
import db from "../../models";
import { ApiPaths } from "../../routers";
interface IServerConstructor {
  port?: string | number;
  secret?: string;
  urlCertificado?: string;
}

export class Server {
  private app;
  private port: string | number;
  private secret: string;
  private urlCertificado: string;

  constructor(props?: IServerConstructor) {
    this.app = express();
    this.port = props?.port || config.server.port;
    this.secret = props?.secret || config.server.secret;
    this.urlCertificado = props?.urlCertificado || config.server.urlCertificado;

    this.middleware();
    this.routes();
  }

  private middleware() {
    // CORS
    this.app.use(
      cors({
        // origin: [
        //   "http://localhost:5173",
        //   "https://inscripciones.iditek.edu.co",
        // ],
        methods: ["GET", "POST", "PUT", "DELETE"],
      })
    );
    //parser
    this.app.use(express.json({ limit: "1gb" }));
    this.app.use(bodyParser.json({ limit: "1gb" }));
    this.app.use(bodyParser.urlencoded({ extended: true, limit: "1gb" }));
    this.app.use(compression());
    //morgan
    this.app.use(morgan("dev"));

    //key
    this.app.set("key", this.secret);
  }

  private async dbConnection() {
    try {
      await db.sequelize.sync({ alter: true });
      console.log("Database online");
    } catch (error) {
      throw error;
    }
  }

  private routes() {
    ApiPaths.forEach(({ url, router }) => {
      const routerModule = require("../../routers/" + router).default;
      this.app.use(`/${url}`, routerModule);
    });

    this.app.get("/", async (_, res) => {
      res.status(200).sendFile(path.join(__dirname, "../../public/index.html"));
    });

    // this.app.use((_, res) => {
    //   res.status(404).sendFile(path.join(__dirname, "../../public/404.html"));
    // });
  }

  async listen() {
    try {
      await this.dbConnection();
      if (!this.urlCertificado) {
        this.app.listen(this.port, () => {
          console.log(`Listening http://localhost:${this.port}`);
        });
        return;
      }

      if (
        !fs.existsSync(`${this.urlCertificado}privkey.pem`) ||
        !fs.existsSync(`${this.urlCertificado}fullchain.pem`)
      ) {
        throw new Error("Certificate files not found");
      }

      const privateKey = fs.readFileSync(
        `${this.urlCertificado}privkey.pem`,
        "utf8"
      );
      const certificate = fs.readFileSync(
        `${this.urlCertificado}fullchain.pem`,
        "utf8"
      );

      const credentials = {
        key: privateKey,
        cert: certificate,
      };
      const httpsServer = https.createServer(credentials, this.app);

      httpsServer.listen(this.port, () => {
        console.log(`HTTPS Server running on port ${this.port}`);
      });
    } catch (error) {
      throw error;
    }
  }
}

export default Server;
