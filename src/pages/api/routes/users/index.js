// api/Users.js

import dbConnect from "../../lib/dbConnect";
import User from "../../model/UserSchema";

export default async function handler(req, res) {
  const { method } = req;
  // console.log(req);

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const users = await User.find({});
        res.status(200).json({ success: true, data: users });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const Users = await User.create(req.body);
        res.status(201).json({ success: true, data: Users });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
