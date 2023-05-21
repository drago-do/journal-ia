// api/Users.js

import dbConnect from "../../lib/dbConnect";
import Article from "../../model/ArticleSchema";

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
          const specificArticle = await Article.findById(id);
          res.status(200).json({ success: true, data: specificArticle });
        } else {
          const articles = await Article.find({});
          res.status(200).json({ success: true, data: articles });
        }
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    case "PUT":
      try {
        const article = await Article.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });

        if (!article) {
          return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: article });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    case "DELETE":
      try {
        const deletedArticle = await Article.findByIdAndDelete(id);

        if (!deletedArticle) {
          return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: deletedArticle });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
