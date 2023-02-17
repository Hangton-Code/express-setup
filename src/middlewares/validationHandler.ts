import { Request, Response, NextFunction } from "express";
import { validationResult, matchedData } from "express-validator";
import { APIError, use } from "../helpers/errorHandler";

const validationHandler = use(
  (req: Request, res: Response, next: NextFunction) => {
    const err = validationResult(req);

    if (!err.isEmpty())
      throw new APIError("Invalid Params", {
        statusCode: 400,
        body: {
          validationResult: err.array(),
        },
      });

    req.body = matchedData(req, {
      includeOptionals: true,
      locations: ["body"],
    });
    req.query = matchedData(req, {
      includeOptionals: true,
      locations: ["query"],
    });

    next();
  }
);

export default validationHandler;
