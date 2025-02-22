const express = require("express");
const router = express.Router();
const Item = require("./models/Items");


router.post("/items", async (req, res) => {
    try {
      const { name, description } = req.body;
      const newItem = new Item({ name, description });
      await newItem.save();
      res.status(201).json(newItem);
    } catch (err) {
      res.status(500).json({ message: "Error creating item", error: err });
    }
  });
  
 
  router.get("/items", async (req, res) => {
    try {
      const items = await Item.find();
      res.status(200).json(items);
    } catch (err) {
      res.status(500).json({ message: "Error fetching items", error: err });
    }
  });
  
 
  router.delete("/items/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deletedItem = await Item.findByIdAndDelete(id);
      if (!deletedItem) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.status(200).json({ message: "Item deleted" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting item", error: err });
    }
  });
  
  module.exports = router;