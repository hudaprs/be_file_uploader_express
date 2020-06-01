const { success, error } = require("../helpers/responseApi");
const config = require("config");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");

// Get files from database without model
const conn = mongoose.createConnection(config.get("mongoURI"));
let gfs;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

/**
 * @route api/files
 * @method GET
 * @desc Get all files
 */
exports.getFiles = async (req, res) => {
  try {
    // Check files data
    const files = await gfs.files.find().toArray();
    if (!files || files.length === 0)
      return res.status(404).json(error("No files found", res.statusCode));

    res.status(200).json(success("Files", files, res.statusCode));
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error("Server error", res.statusCode));
  }
};

/**
 * @route api/files/:fileName
 * @param { string } fileName
 * @method GET
 * @desc Get one file object
 */
exports.getFile = async (req, res) => {
  const { fileName } = req.params;

  try {
    // Check file data
    const file = await gfs.files.findOne({ filename: fileName });
    if (!file || file.length === 0)
      return res.status(404).json(error("File not found", res.statusCode));

    res.status(200).json(success("File detail", file, res.statusCode));
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error("Server error", res.statusCode));
  }
};

/**
 * @route api/files/image/:imageName
 * @param { string } imageName
 * @method GET
 * @desc Get & show image
 */
exports.getImage = async (req, res) => {
  const { imageName } = req.params;

  try {
    // Check file data
    const image = await gfs.files.findOne({ filename: imageName });
    if (!image)
      return res.status(404).json(error("Image not found", res.statusCode));

    // Descructure image object
    const { contentType, filename } = image;

    // Check if is actual image
    if (
      contentType === "image/jpeg" ||
      contentType === "image/jpg" ||
      contentType === "image/png"
    ) {
      const readStream = gfs.createReadStream(filename);
      readStream.pipe(res);
    } else {
      return res.status(400).json(error("Not an image", res.statusCode));
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error("Server error", res.statusCode));
  }
};

/**
 * @route api/files/upload
 * @method POST
 * @desc Upload a file
 */
exports.upload = async (req, res) => {
  if (!req.file)
    return res.status(422).json(error("File is required", res.statusCode));
  res.status(201).json(success("File uploaded", req.file, res.statusCode));
};

/**
 * @route api/files/:id
 * @method DELETE
 * @desc Delete a file
 */
exports.deleteFile = async (req, res) => {
  const { id } = req.params;
  try {
    let file = await gfs.remove({ _id: id, root: "uploads" });

    res.status(200).json(success("File removed", file, res.statusCode));
  } catch (err) {
    console.log(err.message);
    res.status(500).json(error("Server error", res.statusCode));
  }
};
