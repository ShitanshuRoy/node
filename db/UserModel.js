// import mongoose from "../server";
// import userSchema from "../schema/user.schema";
// import BaseModel from "./BaseModel";
// const User = mongoose.model("User", userSchema);
// async function createCourse() {
//   const course = new User({
//     name: "Noob Saibot",
//     email: "Noob@saibot.com",
//     number: "123456789",
//     interests: ["noob", "saibot", "wins"]
//   });
//   const result = await course.save();
//   console.log(result);
// }

// export default User;

import BaseModel from "./BaseModel";
import { default as userSchema } from "../schemas/user.schema";
// import { ApplicationError } from "../lib/errors";
// import { ERROR_CODES, ACTIVE } from "../lib/constants";
// import { generateToken } from "../lib/token";

export default class LoginModel extends BaseModel {
  constructor(connection) {
    super("logininfo", connection);
    this.schema = loginSchema;
    this.name = "logininfo";
    this.model = this.connection.model(this.name, this.schema);
    this.userModel = this.connection.model("user", userSchema);
  }

  async login(phoneNumber) {
    try {
      const verificationCode = getVerificationCode();
      const user = await this.userModel.findOneAndUpdate(
        { phoneNumber },
        { $set: { verificationCode: verificationCode } },
        { new: true }
      );
      if (!user) {
        throw ("Provided mobile number is not registered, please contact system administrator..!!",
        ERROR_CODES.NOT_AUTHORIZED);
      }
      const text = `Your verification code is ${verificationCode}`;
      sendSms(phoneNumber, text);
      return { message: "OTP has been sent successfully..!!" };
    } catch (error) {
      throw error;
    }
  }

  async updateFcmToken(phoneNumber, FCMToken = null) {
    try {
      const login = await this.model.updateMany(
        { phoneNumber },
        { $set: { FCMToken: FCMToken, updatedAt: new Date() } }
      );
      if (!login) {
        throw ("Provided mobile number not found", ERROR_CODES.NOT_AUTHORIZED);
      }
      return { status: true };
    } catch (error) {
      throw error;
    }
  }

  async verify(phoneNumber, verificationCode, IMEINumber, FCMToken) {
    try {
      const user = await this.userModel
        .findOneAndUpdate(
          {
            phoneNumber,
            verificationCode,
            status: ACTIVE
          },
          { $set: { verificationCode: null } },
          { new: true }
        )
        .lean();
      if (!user) {
        throw ("No record found for provided details..!!",
        ERROR_CODES.FORBIDDEN);
      }
      const token = await generateToken(user._id);
      user.token = token;
      await this.model.updateOne(
        { IMEINumber },
        {
          $set: {
            FCMToken,
            phoneNumber,
            updatedAt: new Date()
          },
          $setOnInsert: {
            userId: user._id,
            businessId: user.businessId
          }
        },
        { upsert: true }
      );
      return user;
    } catch (error) {
      throw error;
    }
  }
}
