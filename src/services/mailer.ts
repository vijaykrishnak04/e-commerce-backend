import transporter from "../config/nodeMailer"; // Assuming you have a default export here
import Otp from "../entities/Otp";
import dotenv from 'dotenv';
dotenv.config();

interface IMailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendMail(email: string, fullName: string, OTP: number): Promise<void> {
  const expirationTime = new Date(new Date().getTime() + 3 * 60 * 1000); // OTP expires in 3 minutes
  try {
    const otpData = { email, otp: OTP, expirationTime };
    console.log(otpData);

    // Find existing OTP document
    const existingOtpDoc = await Otp.findOne({ email });
    if (existingOtpDoc) {
      await Otp.findByIdAndDelete(existingOtpDoc._id);
    }

    // Save new OTP document
    const newOtpDoc = new Otp(otpData);
    await newOtpDoc.save();

    // Define mail data with proper types
    const mailData: IMailOptions = {
      from: process.env.MAILER_EMAIL as string,
      to: email,
      subject: "Here is the OTP for registering with our I-Teach",
      text: `Dear ${fullName},\n\nYour One-Time Password (OTP) for registration is: ${OTP}\n\nPlease enter this OTP to complete your registration. This OTP is valid for 3 minutes.\n\nThank you,\nThe i_Teach Team`,
      html: `<div style="font-family: Arial, sans-serif; color: #333;">
          <h3 style="color: #2b56e3;">I-Teach Registration OTP</h3>
          <p>Dear ${fullName},</p>
          <p>Your One-Time Password (OTP) for registration is:</p>
          <p style="font-size: 24px; font-weight: bold; color: #2b56e3;">${OTP}</p>
          <p>Please enter this OTP to complete your registration.</p>
          <p>This OTP is valid for 3 minutes.</p>
          <p>Thank you,</p>
          <p>The i_Teach Team</p>
        </div>`,
    };

    // Send the email
    const info = await transporter.sendMail(mailData);
    console.log('Message sent: %s', info.messageId);
  } catch (err) {
    console.error('Error sending mail: ', err);
  }
}
