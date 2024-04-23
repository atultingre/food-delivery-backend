const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Food = require("./models/Food");

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Cloudinary configuration
cloudinary.config({
  cloud_name: "atultingre",
  api_key: "815861639249892",
  api_secret: "nZG_tVvWFaQXxA8UUOfIoG3f01k",
});

// Routes
router.get("/foods", async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/foods", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("No image file uploaded.");
    }

    // Check if the same image is already present in the database
    // const existingFood = await Food.findOne({ imageChecksum: req.file.md5 });
    // if (existingFood) {
    //   return res
    //     .status(400)
    //     .json({ message: "Product with the same image already exists." });
    // }

    // Upload the image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(req.file.path);
    const imageUrl = uploadedImage.secure_url;

    // Save the image checksum along with the food item
    const newFood = await Food.create({
      name: req.body.name,
      image: imageUrl,
      publicId: uploadedImage.public_id,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
    });

    res.status(201).json(newFood);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/foods/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    res.json(food);
  } catch (err) {
    res.status(404).json({ message: "Food not found" });
  }
});

router.put("/foods/:id", upload.single("image"), async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    // Check if the image is being updated
    let imageUrl = food.image;
    let publicId = food.publicId;
    if (req.file) {
      if (food.imageChecksum !== req.file.md5) {
        // Upload the new image to Cloudinary
        const uploadedImage = await cloudinary.uploader.upload(req.file.path);
        imageUrl = uploadedImage.secure_url;
        publicId = uploadedImage.public_id;
      }
    }

    // Update food details
    food.name = req.body.name || food.name;
    food.image = imageUrl;
    food.price = req.body.price || food.price;
    food.description = req.body.description || food.description;
    food.category = req.body.category || food.category;

    // Save the updated food item
    const updatedFood = await food.save();
    res.json(updatedFood);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/foods/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(food.publicId);

    // Delete the food from the database
    await Food.findByIdAndDelete(req.params.id);

    res.json({ message: "Food and associated image deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
