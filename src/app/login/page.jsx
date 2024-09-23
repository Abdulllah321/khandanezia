"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    secretKey: "",
  });

  const [loginMethod, setLoginMethod] = useState("email"); // 'email' or 'secretKey'
  const [errors, setErrors] = useState({});
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const router = useRouter();

  // Ensure the component is mounted before showing client-side animations or conditionally rendered elements
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (loginMethod === "email") {
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (
        !formData.email.match(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        )
      )
        newErrors.email = "Invalid email format";
      if (formData.password.length < 6)
        newErrors.password = "Password must be at least 6 characters";
    } else {
      if (!formData.secretKey.trim())
        newErrors.secretKey = "Secret key is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true); // Start loading
      try {
        // Construct the data payload based on login method
        const payload =
          loginMethod === "email"
            ? {
                loginMethod: "email",
                email: formData.email,
                password: formData.password,
              }
            : { loginMethod: "secretKey", secretKey: formData.secretKey };

        const response = await axios.post("/api/login", payload);

        // Check if the response is successful
        if (response.status === 200) {
          toast.success(response.data.message);
          router.push("/");
        } else {
          toast.error(response.data.message || "Login failed");
        }
      } catch (error) {
        if (error.response.data.message)
          toast.error(error.response.data.message);
        else toast.error("An unexpected error occurred: " + error.message);
      } finally {
        setLoading(false); // Stop loading
      }
    }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-lg p-6 mx-auto mt-10 bg-white rounded-md shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-center">Login</h2>

      <form onSubmit={handleSubmit}>
        {/* Login Method Toggle */}
        <div className="relative mb-6">
          <div className="relative flex">
            <button
              type="button"
              onClick={() => setLoginMethod("email")}
              className={`w-full py-3 font-bold ${
                loginMethod === "email" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod("secretKey")}
              className={`w-full py-3 font-bold ${
                loginMethod === "secretKey" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              Secret Key
            </button>
          </div>
          <motion.div
            layoutId="toggle"
            className={`absolute bottom-0 left-0 right-0 h-1 rounded-lg transition-all duration-300 bg-blue-600 w-1/2 ${
              loginMethod === "email" ? "left-0" : "left-1/2"
            }`}
          />
        </div>
        <div className="relative">
          {/* Email and Password Fields */}
          {loginMethod === "email" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full"
            >
              {/* Email */}
              <div className="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block py-2.5 px-1 w-full text-gray-900 bg-transparent border-0 border-b-2 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                  placeholder=" "
                />
                <label
                  htmlFor="email"
                  className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Email
                </label>
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="relative z-0 w-full mb-6 group">
                <input
                  type={showPassword ? "text" : "password"} // Toggle password visibility
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block py-2.5 px-1 w-full text-gray-900 bg-transparent border-0 border-b-2 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                  placeholder=" "
                />
                <label
                  htmlFor="password"
                  className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="absolute right-0 top-2"
                  onClick={() => setShowPassword((prev) => !prev)} // Toggle visibility
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>
            </motion.div>
          )}
          {/* Secret Key Field */}
          {loginMethod === "secretKey" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative z-0 w-full mb-6 group"
            >
              <input
                type="text"
                name="secretKey"
                value={formData.secretKey}
                onChange={handleInputChange}
                className={`block py-2.5 px-1 w-full text-gray-900 bg-transparent border-0 border-b-2 ${
                  errors.secretKey ? "border-red-500" : "border-gray-300"
                } appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                placeholder=" "
              />
              <label
                htmlFor="secretKey"
                className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Secret Key
              </label>
              {errors.secretKey && (
                <p className="text-sm text-red-500">{errors.secretKey}</p>
              )}
            </motion.div>
          )}
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? (
            <div className="flex justify-center">
              <svg
                className="w-8 h-8 overflow-hidden text-white animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75 animate-pulse"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
                ></path>
              </svg>
            </div>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
