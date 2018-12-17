import http from "http";
import App from "./App";

declare global {
  namespace Express {
    interface Response {
      sseSetup: any;
      sseSend: any;
    }
  }
}

class Api {
  constructor(private port?: number) {
    this.port = this.normalizePort(process.env.PORT || 3000);
  }
  async initializeApp() {
    try {
      const server = http
        .createServer(App.app)
        .listen(this.port, () => this.onListen(server.address()))
        .on("error", this.onError);
    } catch (error) {
      this.onError(error);
    }
  }

  normalizePort(val: any): number {
    const port = parseInt(val, 10);
    return isNaN(port) ? val : port;
  }

  onListen(addr: any) {
    console.log(`Listening on ${typeof addr === "string" ? "pipe " + addr : "port " + addr.port}`);
  }

  onError(error: any) {
    if (error.syscall !== "listen" || error.code !== "EACCES" || error.code !== "EADDRINUSE") {
      throw error;
    }

    console.log(`${typeof this.port === "string" ? "Pipe " + this.port : "Port " + this.port} ${
        error.code === "EACCES" ? " requires elevated privileges" : " is already in use"
      }`)
  }
}

new Api().initializeApp();
