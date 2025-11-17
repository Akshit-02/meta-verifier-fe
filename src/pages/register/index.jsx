import {
  autoSignIn,
  confirmSignIn,
  getCurrentUser,
  signIn,
  signUp,
} from "aws-amplify/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendWhatsappMessageApi } from "../../services/handleApi";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [session, setSession] = useState(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      console.log("email", email);
      console.log("password", password);
      const user = await signUp({
        username: email.toLowerCase(),
        password: password,
        // options: {
        //   userAttributes: {
        //     phone_number: phone,
        //   },
        // },
      });
      console.log("user", user);
      if (user.isSignUpComplete) {
        // autoSignIn();
        await signIn({
          username: email.toLowerCase(),
          password: password,
        });
        try {
          const currentUser = await getCurrentUser();
          console.log("currentUser", currentUser);
          // await dispatch(fetchUser(currentUser.username));

          // await sendWhatsappMessageApi({ userId: currentUser.username });
          navigate("/dashboard");
        } catch (error) {
          console.error("Error during login:", error);
        }
      }
      if (
        user.nextStep.signInStep ===
        "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
      ) {
        setStep(2);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      console.log("password", password);
      const user = await confirmSignIn({
        challengeResponse: password,
      });
      console.log("user", user);
      if (user.isSignedIn) {
        try {
          const currentUser = await getCurrentUser();
          console.log("currentUser", currentUser);
          // await dispatch(fetchUser(currentUser.username));

          navigate("/dashboard");
          // await sendWhatsappMessageApi({ userId: currentUser.username });
        } catch (error) {
          console.error("Error during password confirmation:", error);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneNumber = (phoneNumber) => {
    // Remove all non-digit characters
    const digitsOnly = phoneNumber.replace(/\D/g, "");

    // Check if it already has the + prefix
    if (phoneNumber.startsWith("+")) {
      return phoneNumber;
    }

    // Add +1 prefix for US numbers if it's a 10-digit number without country code
    if (digitsOnly.length === 10) {
      return `+1${digitsOnly}`;
    }

    // If it's some other format, just add a + at the beginning
    return `+${digitsOnly}`;
  };

  const initiateSignIn = async () => {
    try {
      const formattedPhoneNumber = formatPhoneNumber(phone);

      const result = await signIn({
        username: formattedPhoneNumber,
        options: {
          authFlowType: "CUSTOM_WITHOUT_SRP",
        },
      });
      console.log("result", result);

      setSession(result);
      setStep(4);

      return result;
    } catch (error) {
      console.error("Error in initiateSignIn:", error);
      throw error;
    }
  };

  const handleSignUp = async () => {
    try {
      setIsLoading(true);

      const formattedPhoneNumber = formatPhoneNumber(phone);

      const result = await signUp({
        username: formattedPhoneNumber,
        password: "Briggo@123",
        options: {
          userAttributes: {
            phone_number: formattedPhoneNumber,
          },
        },
      });
      console.log("result", result);

      // After successful signup, initiate sign in
      return await initiateSignIn();
    } catch (error) {
      console.error("Error in signUp:", error);

      // If user already exists, that's fine - proceed to sign in
      if (error.name === "UsernameExistsException") {
        console.log("User already exists, proceeding to sign up");
        return await initiateSignIn();
      } else {
        showToast("Failed to create account. Please try again.", "error");
        return null;
      }
    } finally {
      setIsLoading("");
    }
  };

  const handleSendOtp = async () => {
    setIsLoading(true);
    try {
      const formattedPhoneNumber = formatPhoneNumber(phone);

      const result = await signIn({
        username: formattedPhoneNumber,
        options: {
          authFlowType: "CUSTOM_WITHOUT_SRP",
        },
      });

      console.log("result handleSendOtp", result);
      setStep(4);
      return result;
    } catch (e) {
      console.error("Error occurred while signing-in", e.name, e.message);

      if (e.name === "UserNotFoundException") {
        return handleSignUp();
      } else if (
        e.name === "NotAuthorizedException" &&
        e.message === "Incorrect username or password."
      ) {
        // This usually means user doesn't exist in custom auth flow
        console.log("User not found, attempting sign up");
        return handleSignUp();
      } else if (e.name === "UsernameExistsException") {
        // Try signing in again after a brief delay
        setTimeout(() => handleSendOtp(), 500);
      } else {
        console.error("Unexpected error during sign-in:", e);
        showToast("Error signing in. Please try again.", "error");
      }
      return null;
    } finally {
      setIsLoading("");
    }
  };

  const verifyOtp = async () => {
    try {
      setIsLoading(true);

      if (!otp || otp.length !== 6) {
        showToast("Please enter a valid OTP!", "error");
        return;
      }

      if (!session) {
        // If session is lost, try to get a new one
        const newSession = await signIn({
          username: formatPhoneNumber(phone),
          options: {
            authFlowType: "CUSTOM_WITHOUT_SRP",
          },
        });
        setSession(newSession);
      }

      const confirmResponse = await confirmSignIn({
        challengeResponse: otp,
      });
      console.log("confirmResponse", confirmResponse);

      if (
        confirmResponse?.nextStep?.signInStep === "DONE" ||
        confirmResponse?.isSignedIn
      ) {
        // Successfully verified
        navigate("/dashboard");
        // await sendWhatsappMessageApi({ userId: confirmResponse?.user?.id });
        setSession(null);

        // Check for campaign invite link
      } else {
        // If verification failed but we didn't get an exception

        setOtp("");
      }
    } catch (err) {
      console.error("Error occurred while verifying OTP", err);

      // Handle different error types based on V6 error structure
      if (
        err.name === "CodeMismatchException" ||
        (err.name === "NotAuthorizedException" &&
          err.message === "Incorrect username or password.")
      ) {
      } else if (
        err.name === "NotAuthorizedException" &&
        err.message === "Invalid session for the user."
      ) {
      } else {
      }

      // Clear OTP field on error

      setOtp("");

      // If the session expired, get a new one
      if (err.name === "NotAuthorizedException") {
        try {
          const newSession = await signIn({
            username: formatPhoneNumber(phone),
            options: {
              authFlowType: "CUSTOM_WITHOUT_SRP",
            },
          });
          setSession(newSession);
        } catch (signInErr) {
          console.error("Error refreshing session:", signInErr);
        }
      }
      if (err.message?.includes("Unrecognizable lambda output")) {
      }
    } finally {
      setIsLoading("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F1F1] to-[#D4D4D4] flex items-center justify-center p-6 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#2B2B2B]/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-[#919191]/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#2B2B2B]/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-[#D4D4D4]">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src="/briggoLogo.svg" alt="" className="h-12 w-28" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#2B2B2B] mb-2">Sign Up</h1>
            <p className="text-[#919191]">
              Sign up to continue to your dashboard
            </p>
          </div>

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-[#2B2B2B] mb-2"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    id="phone"
                    type="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                    placeholder="Enter your phone number"
                    className="w-full pl-4 pr-4 py-3.5 bg-[#F1F1F1] border-2 border-[#D4D4D4] rounded-xl text-[#2B2B2B] placeholder-[#919191] focus:outline-none focus:border-[#2B2B2B] focus:bg-white transition-all duration-300"
                  />
                </div>
              </div>

              <button
                onClick={handleSendOtp}
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-[#2B2B2B] to-[#919191] text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending OTP...
                  </span>
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-semibold text-[#2B2B2B] mb-2"
                >
                  Enter OTP
                </label>
                <div className="relative">
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && verifyOtp()}
                    placeholder="Enter your phone number"
                    className="w-full pl-4 pr-4 py-3.5 bg-[#F1F1F1] border-2 border-[#D4D4D4] rounded-xl text-[#2B2B2B] placeholder-[#919191] focus:outline-none focus:border-[#2B2B2B] focus:bg-white transition-all duration-300"
                  />
                </div>
              </div>

              <button
                onClick={verifyOtp}
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-[#2B2B2B] to-[#919191] text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Verifing OTP...
                  </span>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </div>
          )}

          {/* Form 1 */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-[#2B2B2B] mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-[#919191]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-[#F1F1F1] border-2 border-[#D4D4D4] rounded-xl text-[#2B2B2B] placeholder-[#919191] focus:outline-none focus:border-[#2B2B2B] focus:bg-white transition-all duration-300"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-[#2B2B2B] mb-2"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-[#919191]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    id="phone"
                    type="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="Enter your phone number"
                    className="w-full pl-12 pr-4 py-3.5 bg-[#F1F1F1] border-2 border-[#D4D4D4] rounded-xl text-[#2B2B2B] placeholder-[#919191] focus:outline-none focus:border-[#2B2B2B] focus:bg-white transition-all duration-300"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-[#2B2B2B] mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-[#919191]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3.5 bg-[#F1F1F1] border-2 border-[#D4D4D4] rounded-xl text-[#2B2B2B] placeholder-[#919191] focus:outline-none focus:border-[#2B2B2B] focus:bg-white transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#919191] hover:text-[#2B2B2B] transition-colors"
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-[#2B2B2B] to-[#919191] text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing up...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
          )}

          {/* Form 2 */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-[#2B2B2B] mb-2"
                >
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-[#919191]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3.5 bg-[#F1F1F1] border-2 border-[#D4D4D4] rounded-xl text-[#2B2B2B] placeholder-[#919191] focus:outline-none focus:border-[#2B2B2B] focus:bg-white transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#919191] hover:text-[#2B2B2B] transition-colors"
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-[#2B2B2B] to-[#919191] text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing up...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
          )}

          {/* Sign Up Link */}
          {/* <div className="mt-8 text-center">
            <p className="text-[#919191]">
              Don't have an account?{" "}
              <button
                onClick={() => alert("Sign up clicked")}
                className="text-[#2B2B2B] font-semibold hover:text-[#919191] transition-colors"
              >
                Sign up
              </button>
            </p>
          </div> */}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => alert("Back to home")}
            className="text-[#919191] hover:text-[#2B2B2B] transition-colors text-sm font-medium inline-flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
