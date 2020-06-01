const router = require("express").Router();
const {
  getFiles,
  getFile,
  getImage,
  upload,
  deleteFile
} = require("../app/controllers/fileController");
const { uploadFile } = require("../app/middlewares/uploader");

router.get("/", getFiles);
router.get("/:fileName", getFile);
router.get("/image/:imageName", getImage);
router.post("/upload", uploadFile.single("file"), upload);
router.delete("/:id", deleteFile);

module.exports = router;
