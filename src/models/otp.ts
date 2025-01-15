import { Schema } from "mongoose";
import mongoose from "mongoose";
import { generateOtpTemplate } from "../templets/sentOtpTemplets";
import { sendMail } from "../utils/sendMail";

const otpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, expiresIn: "5m" }
);

otpSchema.pre("save", async function genrateOtp() {
  const usename = this.email.split("@")[0];
  console.log("username is ", usename);
  const htmlContent = generateOtpTemplate(usename, this.otp);
  const response = await sendMail(this.email, "OTP", htmlContent);
  console.log("response is ", response);
  console.log("otp is ", this.otp);
});

export const Otp = mongoose.model("Otp", otpSchema);
