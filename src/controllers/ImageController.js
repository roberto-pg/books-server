require("dotenv/config");
const connection = require("../database/connection");
const fs = require("fs");
const { validate: uuidValidate } = require("uuid");

module.exports = {
  async updateImage(req, res) {
    const { id } = req.params;
    const imageurl = process.env.DIR_IMAGE + req.file.filename;

    if (uuidValidate(id) == false) {
      return res.status(400).json({ Error: "Invalid book id" });
    }

    try {
      const book = await connection("books")
        .select("*")
        .where("id", id)
        .first();

      if (!book) {
        return res.status(400).json({ Error: "Book not found" });
      }

      const img = await connection("books")
        .select("imageurl")
        .where("id", id)
        .first();

      var imageName = img.imageurl.split("/")[4];

      fs.unlink(process.env.IMAGE_STORAGE + "/" + imageName, function (err) {
        if (err) {
          console.log("failed to delete local image:" + err);
        } else {
          console.log("successfully deleted local image");
        }
      });

      await connection("books").where("id", id).update({ imageurl: imageurl });

      const updatedBook = await connection("books")
        .select("*")
        .where("id", id)
        .first();

      return res.send(updatedBook);
    } catch (err) {
      return res.status(400).json({ Error: err });
    }
  },
};
