import { NextFunction, Request, Response } from "express";
import { Passwords } from "../utils/password";
import { BadRequestError, UnAuthorizedError } from "@aplaz-tech/error-handler";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //check if exists token in header
  /*
        Session cookies are cookies that last for a session. A session starts when you launch a 
        website or web app and ends when you leave the website or close your browser window. Session cookies 
        contain information that is stored in a temporary memory location which is deleted after the session ends. 
        Unlike other cookies, session cookies are never stored on your device. Therefore, they are also known as 
        transient cookies, non-persistent cookies, or temporary cookies.
        Session cookies are enabled by default. Their purpose is help individual web pages load faster and improve 
        navigation through a website. Each time the browser requests a web page from the server, it includes the 
        session cookie file with its request. The cookie lets the server know which page components the browser 
        has already been sent, so the server doesn't waste time re-sending them. When the browser closes at the end of 
        a session, the file is deleted.
        A session cookie is also known as transient cookie. This type of cookie is stored in temporary memory and is 
        only available during an active browser session. End users can adjust browser settings to decline session cookies, 
        however this often results in a poor user experience.
    */
  if (!req.session?.jwt) {
    throw new UnAuthorizedError();
  }
  //verify JWT token
  try {
    const userData = await Passwords.JWTdecode(req.session.jwt);
    if (userData) {
      //store payload in local express vars
      res.locals.user = userData;
    }
  } catch (error) {
    throw new BadRequestError("something gone wrong in verify user");
  }
  next();
};
