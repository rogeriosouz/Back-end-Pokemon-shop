import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const fileLength = file.originalname
      .toLowerCase()
      .replace(" ", "")
      .split(".").length;

    const extensaoArquivo = file.originalname
      .toLowerCase()
      .replace(" ", "")
      .split(".")[fileLength - 1];

    const novoNomeArquivo = require("crypto").randomBytes(64).toString("hex");

    cb(null, `${novoNomeArquivo}.${extensaoArquivo}`);
  },
});

const upload = multer({ storage });

export default upload;
