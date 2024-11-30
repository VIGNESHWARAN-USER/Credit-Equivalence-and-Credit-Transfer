import axios from "axios";
import { useState } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import logo from "../images/logo.jpeg";

function Login({ setEmail, email, setOTP, setname, setuser, setrole }) {
  const [pass, setpass] = useState("");
  const [err, setErr] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/login", { Email: email, pass });
      if (response.data.success) {
        const val = `${response.data.message.first} ${response.data.message.last}`;
        setname(val);
        setuser(response.data.message);
        setrole(response.data.message.role);
        setErr("");
        localStorage.setItem("user", JSON.stringify(response.data.message));
        navigate("../home");
      } else {
        setErr(response.data.message);
      }
    } catch (error) {
      setErr("Internal server error");
    } finally {
      setLoading(false);
    }
  };

  const navigateToOtp = async () => {
    if (email) {
      const OTP = Math.floor(Math.random() * 9000 + 1000);
      setOTP(OTP);
      console.log("Generated OTP:", OTP);
      try {
        const response = await axios.post("http://localhost:3001/send_recovery_email", { OTP, recipient_email: email });
        console.log(response.data);
        if (response.data.success) {
          setErr("");
          navigate("/otp");
        } else {
          setErr(response.data.message);
        }
      } catch (error) {
        setErr("Internal server error");
      }
    } else {
      alert("Please enter your email");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.target.name === "email") {
        document.getElementById("password").focus();
      } else if (e.target.name === "password") {
        handleSubmit(e);
      }
    }
  };

  return (
    <div className="flex h-screen bg-green-100">
      
      <div className="min-h-screen bg-gradient-to-b from-green-200 to-green-400 flex flex-col items-center justify-center p-4 w-full">
        <div className="bg-green-200/80 flex items-center flex-col backdrop-blur-lg rounded-2xl shadow-lg p-6 w-1/3 md:p-12 mt-14">
        <img src={logo} alt="CECT Portal" className="w-20 h-20 mb-4 rounded-full mx-auto" />
          <h2 className="text-center text-3xl font-semibold text-gray-800">Welcome Back</h2>
          <p className="text-center text-gray-600 mt-2">Login to your account</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="email"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-green-500 focus:ring focus:ring-green-200"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={pass}
                  onChange={(e) => setpass(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="current-password"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-green-500 focus:ring focus:ring-green-200"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center px-3 focus:outline-none"
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>
            <Link
              to="/otp"
              onClick={navigateToOtp}
              className="text-sm font-medium text-green-600 hover:text-green-500 block text-center mt-3"
            >
              Forgot Password?
            </Link>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mt-3"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Continue"}
            </button>
            {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

Login.propTypes = {
  setEmail: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  setOTP: PropTypes.func.isRequired,
  setname: PropTypes.func.isRequired,
  setuser: PropTypes.func.isRequired,
  setrole: PropTypes.func.isRequired,
};

export default Login;
