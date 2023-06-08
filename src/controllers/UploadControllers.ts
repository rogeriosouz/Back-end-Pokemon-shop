import { Request, Response } from "express";
class UploadControllers {
  upload(req: Request, res: Response) {
    try {
      const url = `http://localhost:3333/files/${req.file?.filename}`;

      return res.status(200).json({ url });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Error internal sevidor!" });
    }
  }
}

export default new UploadControllers();
