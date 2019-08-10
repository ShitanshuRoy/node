const express = require("express");
const Joi = require("joi");
const router = express.Router();

function validateCourse(course) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };

  const result = Joi.validate(course, schema);
  return result;
}

const courses = [
  { id: 1, name: "couses1" },
  { id: 2, name: "couses2" },
  { id: 3, name: "couses3" },
  { id: 4, name: "couses4" },
  { id: 5, name: "couses5" }
];
router.get("/", (req, res) => {
  res.send(courses);
});
router.get("/:id", (req, res) => {
  console.log(req.params.id);
  const course = courses.find(c => {
    return c.id === parseInt(req.params.id);
  });
  if (course) {
    res.send(course);
  } else {
    res.status(404).send("The course with the given id does not exist");
  }
});
router.post("/", (req, res) => {
  if (result.error) {
    res.status(400).send(
      result.error.details.map(val => {
        return val.message;
      })
    );
    return;
  }
  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
});

router.put("/:id", (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID does not exist");
  console.log(req.body);
  course.name = req.body.name;
  console.log(validateCourse(req.body));
  const { error } = validateCourse(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  res.send(course);
  console.log(courses);
});
router.delete("/:id", (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given Id was not found");
  const index = courses.indexOf(course);
  courses.splice(index, 1);
});

module.exports = router;
