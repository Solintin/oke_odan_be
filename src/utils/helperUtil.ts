import AuthConfig from "@src/configs/auth.config";
import speakeasy from "speakeasy";

const helperUtil = {
  generateOtp() {
    return speakeasy.totp({
      secret: AuthConfig.TOTP_SECRET_KEY,
      encoding: "base32",
    });
  },

  verifyOtp(token: string, window = 5) {
    return speakeasy.totp.verify({
      secret: AuthConfig.TOTP_SECRET_KEY,
      encoding: "base32",
      token,
      window,
    });
  },
};

export default helperUtil;
