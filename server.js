const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/dustbin")
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch(err => console.error("Could not connect to MongoDb", err));

//Schema types
//String
//Number
//Date
//Buffer
//Boolean
//ObjectID
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobileNumber: { type: String, lowercase: true },
  mobile: {
    type: Number,
    required: function() {
      return this.isPublished;
    },
    min: 10,
    max: 200,
    //Force rounding of the sent number
    get: v => Math.round(v),
    set: v => Math.round(v)
  },
  interests: [String],
  date: { type: Date, default: Date.now },

  //Async validator
  tags: {
    type: Array,
    validate: {
      isAsync: true,
      validator: function(v, callback) {
        setTimeout(() => {
          //DO so async work;
          console.log("async validate");
          const result = v && v.length > 0;
          callback(result);
        }, 4000);
      },
      message: "A course should have at least one tag"
    }
  }
});
const User = mongoose.model("User", userSchema);
async function createCourse() {
  const course = new User({
    name: "Noob Saibot",
    email: "Noob@saibot.com",
    number: "123456789",
    interests: ["noob", "saibot", "wins"]
  });

  try {
    const result = await course.save();
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}

async function getCourses() {
  const users = await User.find();
  //Find methods
  //   const users = await User.find({ name: "Noob" })
  //     .limit(10)
  //     .sort({ name: 1 })
  //     .select({name: 1 , email: 1});

  //Comparison operators
  //eq (equal)
  //ne (not equal)
  //gt (greater than)
  //gte (greater than or equal to)
  //in
  //nin (not in)

  //   const users = await User.find({ price: { $gte: 10, $lte: 20 } }).find({
  //     price: { $in: [10, 15, 20] }
  //   });
  //OR
  //   const users = await User.find({
  //     isActive: true,
  //     tags: { $in: ["frontend", "backend"] }
  //   });
  //OR OPERATOR and STRING NOTATION

  //   const users = await User.find({
  //     isActive: true
  //   })
  //     .or({ tags: "frontend" }, { tags: "backend" })
  //     .sort("-price")
  //     .select("name email isActive");

  //Logical Query operators

  //   const users = await User.find()
  //     .or([{ name: "Noob", isActive: true }])
  //     .and([]);

  //Regular Expressions

  // Starts with No
  //Ends with bot
  // i for case insensitive
  //Contains Noob
  //   const users = await User.find({ name: /^No/ })
  //     .find({ name: /bot$/i })
  //     .find({ name: /.*Noob*/ });

  //Pagination with Skip
  //   const pageNumber = 2;
  //   const pageSize = 10;
  //   const users = await User.skip((pageNumber - 1) * pageSize).limit(pageSize);
  console.log(users);
}
async function updateCourse(id) {
  // Approach: Query first
  // findById()
  // Modify its properties
  // save()
  // const user = await User.findById(id);
  // if (!user) return;
  // // user.isActive = true;
  // user.set({
  //   isActive: true,
  //   name: "Sub zero"
  // });
  // const result = await user.save();
  // console.log(result);
  // Approach: Update first
  // Update directly
  // Optionally: get the updated document SOLUTION BELOW
  // const result = await User.update(
  //   { _id: id },
  //   {
  //     $set: {
  //       name: "Grimgore Ironhide",
  //       isActive: false
  //     }
  //   }
  // );
  // console.log(result);
  //WHEN WE WANT TO GET DOCUMENT THAT WAS UPDATED
  // const user = await User.findByIdAndUpdate(
  //   id,
  //   {
  //     $set: {
  //       name: "Jack",
  //       isActive: false
  //     }
  //   },
  //   { new: true }
  // );
  // console.log(user);
}
async function removeUser(id) {
  //DELETE ONE
  const result = await User.deleteOne({ _id: id });
  console.log(result);
  //DELETE MANY
  // const course = await course.findByIdAn(dRemove(id);
  // console.log(result);
}
//updateCourse("5d452738f7e0d7207320a611");
createCourse();
setTimeout(() => {
  getCourses();
}, 100);

module.exports = mongoose;
