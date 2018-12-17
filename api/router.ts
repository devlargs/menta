import { Router } from "express";
import {
  Test,
  Users
} from "./routes";

import { validateToken } from "./middleware/check-token";

class AppRouter {
  public router: Router;

  constructor(app: any) {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.Test("/test", new Test());
    this.Users("/users", new Users());
  }

  private Test(url: string, api: Test){
    this.router.get(url, api.testApi());
  }

  private Users(url: string, api: Users) {
    this.router.get(`${url}/stream`, api.stream());
    this.router.get(url, validateToken, api.getUsers());
    this.router.post(url, api.postUsers());
    this.router.post(`${url}/login`, api.loginUser());
  }
}

export default AppRouter;
