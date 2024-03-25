import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/tokenUtils";
import { IUser } from "../../entities/User";
import { IUserRepository } from "../../repositories/UserRepository";

export class OtpVerify {
  // Assuming you need an IOtpRepository to handle OTP related operations
  constructor(private userRepository: IUserRepository) {}

  async execute(
    user: IUser,
    otp: number
  ): Promise<{
    userCredentials: IUser;
    accessToken: String;
    refreshToken: String;
  }> {
    // Find the OTP data. I'm assuming there is an `IOtpRepository` where this function should reside.
    const otpData = await this.userRepository.findOtp(user.email);
  
    // You need to implement the logic to compare the OTP provided with the one in the database
    if (otpData && otpData.otp === otp) {
      const userPayload = {
        _id: user._id,
        roles: user.roles, // Assuming roles is a string array
      };

      const accessToken = await generateAccessToken(userPayload);
      const refreshToken = await generateRefreshToken(userPayload);

      // Persist the new user entity to the repository
      const userCredentials = await this.userRepository.create(user);
      // Proceed with user logic (e.g., updating the user status or returning the user)
      return { userCredentials, accessToken, refreshToken };
    } else {
      // OTP does not match or not found
      throw new Error("Invalid or expired OTP");
    }
  }
}
