// api/Users.js

import dbConnect from "../../lib/dbConnect";
import PDF_File from "../../model/PdfSchema";
export default async function handler(req, res) {
  const { method } = req;
  // console.log(req);

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const pdfs = await PDF_File.find({});
        res.status(200).json({ success: true, data: pdfs });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const busboy = new Busboy({ headers: req.headers });
        let formData = {};
        busboy.on("field", (fieldName, val) => {
          formData[fieldName] = val;
        });
        console.log(formData);
        busboy.on(
          "file",
          async (fieldname, file, filename, encoding, mimetype) => {
            const fileStream = file.pipe(
              fs.createWriteStream(
                path.join(process.cwd(), "public", "uploads", filename)
              )
            );
            fileStream.on("finish", async () => {
              const pdf = await PDF_File.create({
                article_ref: formData.article_ref,
                pdf_file: {
                  data: fs.readFileSync(
                    path.join(process.cwd(), "public", "uploads", filename)
                  ),
                  contentType: mimetype,
                },
              });
              res.status(201).json({ success: true, data: pdf });
            });
          }
        );
        req.pipe(busboy);
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
