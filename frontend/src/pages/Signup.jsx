import { useState, useEffect } from "react";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../validators/SignupValidator";
import { signUser } from "../services/authService";
  import { useNavigate } from "react-router-dom";



function Signup() {
  const images = ["/headphones.png", "/sneakers.png", "/handbag.png"];


const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = useState(0);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [apiError, setApiError] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setApiError("");

    const validateuserName = validateName(name);
    if (validateuserName) {
      setNameError(validateuserName);
      console.log(validateuserName);
      return;
    }
    const validateEmailCheck = validateEmail(email);

    if (validateEmailCheck) {
      setEmailError(validateEmailCheck);
      return;
    }

    const passwordCheck = validatePassword(password);

    if (passwordCheck) {
      setPasswordError(passwordCheck);
      return;
    }

    // if all good i come here then i can normalise things and send

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
    };

    try {
      const response = await signUser(payload);

      console.log("Signup successful:", response);

      // Clear form after successful signup
      setName("");
      setEmail("");
      setPassword("");
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error);

      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

      setApiError(message);
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  },[]);

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#302D2A]">
      {/* Background lights */}
      <div>...</div>
      <div>...</div>
      <div>...</div>

      {/* Signup card */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-5xl min-h-[600px] grid grid-cols-1 md:grid-cols-2 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl overflow-hidden">
          {/* Left section */}

          {/* Left section */}
          <div className="relative flex flex-col justify-between p-8 md:p-12 bg-black/10">
            {/* Brand */}
            <div>
              <h2 className="text-white text-2xl font-semibold tracking-wide">
                LUXORA.
              </h2>
              <p className="text-white/50 text-sm mt-1">
                Experience premium living.
              </p>
            </div>

            {/* Product image */}
            <div className="flex flex-1 items-center justify-center py-6">
              <img
                src={images[activeIndex]}
                alt="Premium wireless headphones"
                className="w-full max-w-[420px] h-[320px] object-contain drop-shadow-2xl"
              />
            </div>

            {/* Product description */}
            <div>
              <h3 className="text-white text-3xl font-semibold">
                Shop Beyond Limits.
              </h3>

              <p className="text-white/60 text-sm mt-3 leading-relaxed max-w-sm">
                Discover fashion, electronics, home essentials and more — all in
                one place.
              </p>

              {/* Carousel dots */}

              <div className="flex items-center gap-3 mt-8">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      activeIndex === index
                        ? "w-10 bg-white"
                        : "w-2.5 bg-white/30 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right section */}
          <div className="flex flex-col justify-center px-8 py-10 md:px-12 lg:px-16 bg-white/5">
            {/* Heading */}
            <div className="mb-8">
              <p className="text-white/50 text-sm font-medium tracking-widest uppercase">
                Start your journey
              </p>

              <h2 className="text-white text-3xl font-semibold mt-3">
                Create Account
              </h2>

              <p className="text-white/50 text-sm mt-2">
                Join LUXORA and discover something extraordinary.
              </p>
            </div>

            {/* Signup Form */}
            <form
              className="flex flex-col gap-5"
              onSubmit={handleSubmit}
              noValidate
            >
              {/* Full Name */}
              <div>
                <label className="block text-white/70 text-sm mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your  name"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-white/30 outline-none focus:border-white/50 transition-all"
                />
                {nameError && (
                  <p className="text-[#FCA5A5] text-xs mt-2">{nameError}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-white/70 text-sm mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-white/30 outline-none focus:border-white/50 transition-all"
                />
                {emailError && (
                  <p className="text-[#FCA5A5] text-xs mt-2">{emailError}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-white/70 text-sm mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-white/30 outline-none focus:border-white/50 transition-all"
                />
                {passwordError && (
                  <p className="text-[#FCA5A5] text-xs mt-2">{passwordError}</p>
                )}
              </div>

              {/* Signup Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-white text-[#24211F] font-semibold hover:bg-white/85 transition-all duration-300 mt-2"
              >
                Create Account
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-white/15"></div>
              <div className="flex-1 h-px bg-white/15"></div>
            </div>
            {apiError && <p className="text-[#FCA5A5] text-sm">{apiError}</p>}

            {/* Login Link */}
            <p className="text-center text-white/50 text-sm mt-8">
              Already have an account?
              <a
                href="/login"
                className="text-white font-semibold ml-1 hover:underline"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
