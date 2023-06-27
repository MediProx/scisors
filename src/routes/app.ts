import { Express, Request, Response } from "express";
import { shortenUrl } from "../controller/shortUrl.controller";
import { redirectURL } from "../controller/redirect.controller";
import { userLogin, userSignup } from "../controller/user.controller";
import { auth } from "../middlewares/auth";

function routes(app: Express) {
  app.get("/test", (req: Request, res: Response) => {
    return res.send("App is okay");
  });

  app.post("/shorten", auth,  shortenUrl);

  app.get("/:url", redirectURL);

  //user sign up
  app.post("/users/sign-up", userSignup);

  //user log in
  app.post("/users/log-in", userLogin)
}

export default routes;