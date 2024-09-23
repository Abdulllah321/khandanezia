"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // For show/hide password icon
import { FiPlusCircle, FiMinusCircle } from "react-icons/fi"; // For add/remove phone number icons
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumbers: [""],
    dob: "",
    gender: "Male",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectOpen, setSelectOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
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

  // Add phone number input dynamically
  const addPhoneNumber = () => {
    setFormData({
      ...formData,
      phoneNumbers: [...formData.phoneNumbers, ""],
    });
  };

  // Remove phone number input dynamically
  const removePhoneNumber = (index) => {
    const updatedPhones = formData.phoneNumbers.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      phoneNumbers: updatedPhones,
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (
      !formData.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    )
      newErrors.email = "Invalid email format";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (formData.phoneNumbers.length === 0 || formData.phoneNumbers[0] === "")
      newErrors.phoneNumbers = "At least one phone number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true); // Start loading
      try {
        const response = await axios.post("/api/register", formData);

        if (response.status === 200) {
          toast.success(response.data.message); // Success alert
          router.push("/login"); // Navigate to login page
        } else {
          toast.error(response.data.error); // Error alert
        }
      } catch (error) {
        toast.error("An unexpected error occurred: " + error.message); // Handle unexpected errors
      } finally {
        setLoading(false); // Stop loading
      }
    }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-lg p-6 mx-auto mt-10 bg-white rounded-md shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-center">
        Register Your Self
      </h2>

      <form onSubmit={handleSubmit}>
        {/* First Name */}
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={`block py-2.5 px-1 w-full text-gray-900 bg-transparent border-0 border-b-2 ${
              errors.firstName ? "border-red-500" : "border-gray-300"
            } appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
            placeholder=" "
          />
          <label
            htmlFor="firstName"
            className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            First Name
          </label>
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={`block py-2.5 px-1 w-full text-gray-900 bg-transparent border-0 border-b-2 ${
              errors.lastName ? "border-red-500" : "border-gray-300"
            } appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
            placeholder=" "
          />
          <label
            htmlFor="lastName"
            className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Last Name
          </label>
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName}</p>
          )}
        </div>

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
            type={showPassword ? "text" : "password"}
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
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute text-gray-500 cursor-pointer right-3 top-3"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            className={`block py-2.5 px-1 w-full text-gray-900 bg-transparent border-0 border-b-2 ${
              errors.dob ? "border-red-500" : "border-gray-300"
            } appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
            placeholder=" "
          />
          <label
            htmlFor="dob"
            className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Date of Birth
          </label>
          {errors.dob && <p className="text-sm text-red-500">{errors.dob}</p>}
        </div>

        {/* Phone Numbers (Dynamic) */}
        {formData.phoneNumbers.map((phone, index) => (
          <div
            key={index}
            className="relative z-0 flex items-center w-full mb-6 group"
          >
            <input
              type="text"
              name={`phone-${index}`}
              value={phone}
              onChange={(e) => {
                const updatedPhones = [...formData.phoneNumbers];
                updatedPhones[index] = e.target.value;
                setFormData({ ...formData, phoneNumbers: updatedPhones });
              }}
              className="block py-2.5 px-1 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder="Phone Number"
            />
            {index > 0 && (
              <button
                type="button"
                onClick={() => removePhoneNumber(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <FiMinusCircle size={24} />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addPhoneNumber}
          className="flex items-center mb-6 text-blue-600"
        >
          <FiPlusCircle size={24} className="mr-2" /> Add Another Phone Number
        </button>

        {/* Gender */}
        <div className="relative z-0 w-full mb-6 group">
          <div
            onClick={() => setSelectOpen(!selectOpen)}
            className="relative cursor-pointer py-2.5 px-1 w-full text-gray-900 bg-transparent border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          >
            {formData.gender}
          </div>
          <label className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Gender
          </label>
          <AnimatePresence>
            {selectOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 w-full bg-white border border-gray-300"
              >
                {["Male", "Female"].map((option) => (
                  <motion.li
                    key={option}
                    onClick={() => {
                      setFormData({ ...formData, gender: option });
                      setSelectOpen(false);
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                  >
                    {option}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
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
            "Register"
          )}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
