import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Password({ email }) {
  const [svg1, setSvg1] = useState(false);
  const [svg2, setSvg2] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = (id, setState, state) => (e) => {
    e.preventDefault();
    const input = document.getElementById(id);
    input.type = input.type === "password" ? "text" : "password";
    setState(!state);
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) 
    {
      setError("Passwords do not match");
      return;
    }
    try 
    {
      const Email = email;
      const response = await axios.post("http://localhost:3001/reset-password", { newPassword, Email });
      if (response.data.success) {
        navigate("/login");
      } else {
        setError(response.data.message);
      }
    } 
    catch (error) 
    {
      setError("Internal server error");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') 
    {
      e.preventDefault();
      if (e.target.name === 'newPassword') {
        document.getElementById('pass2').focus();
      } else if (e.target.name === 'confirmPassword') {
        changePassword(e);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 to-green-400 flex flex-col items-center justify-center p-4 w-full">
        <div className="bg-green-200/80 flex items-center flex-col backdrop-blur-lg rounded-2xl shadow-lg p-6 md:p-12">
            <h2 className="text-center text-2xl md:text-3xl font-semibold text-gray-800">Reset Password</h2>
            <form onSubmit={changePassword} className="mt-8 space-y-6">
              <div className="relative">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="new-password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-green-500 focus:ring focus:ring-green-200"
                />
                <button
                  className="absolute right-3 top-9 text-gray-500"
                  onClick={togglePasswordVisibility("newPassword", setSvg1, svg1)}
                >
                  {svg1 ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="relative mt-4">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="new-password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-green-500 focus:ring focus:ring-green-200"
                />
                <button
                  className="absolute right-3 top-9 text-gray-500"
                  onClick={togglePasswordVisibility("confirmPassword", setSvg2, svg2)}
                >
                  {svg2 ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mt-4"
              >
                Reset Password
              </button>
            </form>
          </div>
        </div>
    
  );
}

export default Password;
