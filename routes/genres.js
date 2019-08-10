const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const genereSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
});
const Genre = new mongoose.model(
  "Genre",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    }
  })
);
router.get("/", async (req, res) => {
  const generes = await genereSchema.find();
  res.send(genres);
});

router.post("/", (req, res) => {
  let genre = new Genre({ name: req.body.name });
 genre = await genre.save();
  res.send(genre);
});
router.put("/:id" , (req,res)=>{
   const genre = await Genre.findByIdAndUpdate(req.params.id , {name:req.body.name} )
})