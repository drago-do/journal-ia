// api/Articles.js

import dbConnect from "../../lib/dbConnect";
import Article from "../../model/ArticleSchema";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const articles = await Article.find({});
        res.status(200).json({ success: true, data: articles });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    case "POST":
      try {
        const articles = await Article.create(req.body);
        res.status(201).json({ success: true, data: articles });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
