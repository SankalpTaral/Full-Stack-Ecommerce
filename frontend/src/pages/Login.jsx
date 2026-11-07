import { useState ,useEffect } from "react";
import { validateEmail, validatePassword } from "../validators/SignupValidator";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";




function Login() {

  const images =[
    "./public/headphones.png",
    "./public/sneakers.png",
    "./public/handbag.png"
  ]
  const navigate = useNavigate();


  const [activeIndex , setActiveIndex] = useState(0);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const[apiError , setApiError] = useState("");






  useEffect(()=>{
    const timer = setInterval(()=>{
        setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
      },5000)

      return ()=>{
        clearInterval(timer);
      }
  },[])



  


  async function handleSubmit(e){
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    

       const validateEmailCheck = validateEmail(email);
    // validate email  formatter 
        if (validateEmailCheck) {
          setEmailError(validateEmailCheck);
          return;
        }

    
        // validate password  formatter
        const passwordCheck = validatePassword(password);

    
        if (passwordCheck) {
          setPasswordError(passwordCheck);
          return;
        }
    
        // user has entered correct format 

        // next step here is now check if username and password are correct or no u need to make an api
      
        const payload = {email : email.trim().toLowerCase() , password : password};
        try{
          const response = await loginUser(payload);
          setApiError("");
          console.log("Login succesfull ", response);
          setEmail("");
          setPassword("");
          navigate("/profile");          

        }catch(error){
        
             console.error("Signup failed:", error);

      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

      setApiError(message);
        }

  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#302D2A]">

      {/* Background lights */}
      <div className="absolute top-[-150px] left-[-100px] w-[350px] h-[350px] bg-white/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] bg-white/10 blur-[130px] rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#B7A99A]/10 blur-[120px] rounded-full" />

      {/* Login card */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-5xl min-h-[600px] grid grid-cols-1 md:grid-cols-2 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl overflow-hidden">

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
              {/* Add your product image here */}
              <div className="w-full max-w-[420px] h-[320px] flex items-center justify-center">
                <img src={images[activeIndex]} alt="" />
              </div>
            </div>

            {/* Product description */}
            <div>
              <h3 className="text-white text-3xl font-semibold">
                Shop Beyond Limits.
              </h3>

              <p className="text-white/60 text-sm mt-3 leading-relaxed max-w-sm">
                Discover fashion, electronics, home essentials and more — all
                in one place.
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
                Welcome Back
              </p>

              <h2 className="text-white text-3xl font-semibold mt-3">
                Sign In
              </h2>

              <p className="text-white/50 text-sm mt-2">
                Sign in to your LUXORA account and continue exploring.
              </p>
            </div>

            {/* Login form */}
            <form className="flex flex-col gap-5" onSubmit ={handleSubmit} noValidate >

              {/* Email */}
              <div>
                <label className="block text-white/70 text-sm mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value = {email}
                  onChange = {(e)=>setEmail(e.target.value)}
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
                  placeholder="Enter your password"
                   value = {password}
                   onChange = {(e)=>setPassword(e.target.value)}
                   
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-white/30 outline-none focus:border-white/50 transition-all"
                />

                  {passwordError && (
                  <p className="text-[#FCA5A5] text-xs mt-2">{passwordError}</p>
                )}
              </div>

              {/* Login button */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-white text-[#24211F] font-semibold hover:bg-white/85 transition-all duration-300 mt-2"
              >
                Sign In
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-white/15" />
              <div className="flex-1 h-px bg-white/15" />
               {apiError && (
                  <p className="text-[#FCA5A5] text-xs mt-2">{apiError}</p>
                )}
            </div>

            {/* Signup link */}
            <p className="text-center text-white/50 text-sm mt-4">
              Don't have an account?
              <a
                href="/signup"
                className="text-white font-semibold ml-1 hover:underline"
              >
                Create Account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
