// api/Users.js

import dbConnect from "../../lib/dbConnect";
import User from "../../model/UserSchema";

export default async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;
  // console.log(req);

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        // Si se proporciona un ID, se obtiene un usuario específico
        if (id) {
          const user = await User.findById(id);
          res.status(200).json({ success: true, data: user });
        } else {
          const users = await User.find({});
          res.status(200).json({ success: true, data: users });
        }
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "PUT":
      try {
        const user = await User.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });

        if (!user) {
          return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "DELETE":
      try {
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
          return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: deletedUser });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
