import { UserRepository } from "src/repositories/UserRepository";
import bcrypt from "bcryptjs";

export class ChangePasswordUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(
    email: string,
    newPassword: string,
    otp: number
  ): Promise<{ success: boolean; message: string }> {
    try {
      const otpData = await this.userRepository.findOtp(email);
      const user = await this.userRepository.findByEmail(email);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      if (user && otpData && otpData.otp === Number(otp)) {
        const result = await this.userRepository.update(user._id, {
          password: hashedPassword,
        });
        if (result) {
          return { success: true, message: "password changed successfully" };
        } else {
          return {
            success: false,
            message:
              "An error occured while changing password, try again later!!!",
          };
        }
      } else {
        return {
          success: false,
          message: "Invalid or Expired otp",
        };
      }
    } catch (err) {
      throw new Error(err);
    }
  }
}
