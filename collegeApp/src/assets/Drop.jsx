import { useState } from "react";
import PropTypes from 'prop-types';
import axios from "axios";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { FaBook, FaCode, FaClipboard, FaLayerGroup, FaCheckCircle } from 'react-icons/fa';

const Drop = ({ user }) => {
  const [category, setCategory] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [semester, setSemester] = useState("");
  const [credits, setCredits] = useState("");
  const [courseName, setCourseName] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const showAlert = (title, text, icon) => {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: 'Continue'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isConfirmed) 
    {
      Swal.fire({
        title: 'Confirmation Required',
        text: 'Please confirm that the information provided is accurate.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    setLoading(true);

    try 
    {
      const response = await axios.post("http://localhost:3001/drop", {
      name: user.first + " " + user.last,
      sec: user.sec,
      year: user.year,
      dept: user.dept,
      Email: user.Email,
      category,
      courseName,
      semester,
      credits,
      courseCode
      });
      showAlert('Submission Successful', 'A copy of the form has been sent to your email.', 'success');
      navigate('../home');
    } 
    catch (error) 
    {
      console.error('Error submitting drop request:', error);
      Swal.fire({
        title: 'Submission Error',
        text: 'Failed to submit drop request. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } 
    finally 
    {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 to-green-400 flex flex-col items-center justify-center p-4">
      <div className="bg-green-200/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 mt-14 md:p-12">
        <div className="text-green-800 text-4xl font-bold mb-8 text-center">
          Course Drop Form
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-lg font-semibold mb-2" htmlFor="category">
                <FaLayerGroup className="inline-block mr-2 text-green-500"/> Category:<span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                className="border-2 border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="" disabled>Select Category</option>
                <option value="PC">PC</option>
                <option value="PE">PE</option>
                <option value="OE">OE</option>
              </select>
            </div>
            <div>
              <label className="block text-lg font-semibold mb-2" htmlFor="courseCode">
                <FaCode className="inline-block mr-2 text-green-500"/> Course Code:<span className="text-red-500">*</span>
              </label>
              <input
                id="courseCode"
                type="text"
                className="border-2 border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                placeholder="Enter the course code"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-lg font-semibold mb-2" htmlFor="courseName">
                <FaClipboard className="inline-block mr-2 text-green-500"/> Course Name:<span className="text-red-500">*</span>
              </label>
              <input
                id="courseName"
                type="text"
                className="border-2 border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                placeholder="Enter the course name"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-lg font-semibold mb-2" htmlFor="semester">
                <FaBook className="inline-block mr-2 text-green-500"/> Semester:<span className="text-red-500">*</span>
              </label>
              <select
                id="semester"
                className="border-2 border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                required
              >
                <option value="" disabled>Select Semester</option>
                {["I", "II", "III", "IV", "V", "VI", "VII", "VIII"].map((sem) => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-lg font-semibold mb-2" htmlFor="credits">
                <FaCheckCircle className="inline-block mr-2 text-green-500"/> Credits:<span className="text-red-500">*</span>
              </label>
              <select
                id="credits"
                className="border-2 border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                required
              >
                <option value="" disabled>Select Credits</option>
                {[1, 2, 3, 4].map((credit) => (
                  <option key={credit} value={credit}>{credit}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center mb-8">
            <input
              type="checkbox"
              id="confirmDrop"
              className="mr-2"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              required
            />
            <label htmlFor="confirmDrop" className="text-lg font-semibold">
              I confirm that the information provided is accurate and I undertake full responsibility.
            </label>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!isConfirmed || loading}
              className={`py-3 px-6 rounded-lg font-semibold text-white transition duration-200 ${
                !isConfirmed || loading ? 'bg-gray-400 cursor-not-allowed opacity-50' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

Drop.propTypes = {
  user: PropTypes.object.isRequired,
};

export default Drop;
