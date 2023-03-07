import { Request, Response } from "express";
import { User } from "../models/User";

// edit profile data such as name
function editProfileController(req: Request, res: Response) {
  (req.user as User).update({
    ...req.body,
  });

  res.end();
}

// edit avatar
function editAvatarController(req: Request, res: Response) {
  console.log(req.file, req.body);

  res.send();
}

export { editProfileController, editAvatarController };
