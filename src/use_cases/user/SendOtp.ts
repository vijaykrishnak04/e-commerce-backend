import { UserRepository } from "../../repositories/UserRepository";
import { sendMail } from "../../services/mailer";

export class SendOtpUseCases {
  constructor(private userRepository: UserRepository) {}

  async execute(
    userMail: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const user = await this.userRepository.findByEmail(userMail);
      if (user) {
        const OTP = Math.floor(100000 + Math.random() * 900000);
        console.log(OTP);

        sendMail(user.email, user.username, OTP);
        return { success: true, message: "otp sent!!!" };
      } else {
        return { success: false, message: "user with this email does not exist" };
      }
    } catch (err) {
      throw new Error(err);
    }
  }
}
