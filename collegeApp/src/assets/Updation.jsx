import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaQuestionCircle, FaCheckCircle, FaBook, FaLink, FaStar } from 'react-icons/fa';

const Undertaking = ({ user }) => {
  const [mark, setMark] = useState('');
  const [grade, setGrade] = useState('');
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storedMail, setStoredMail] = useState('');
  const [courseTitles, setCourseTitles] = useState([]);
  const [courseLink, setCourseLink] = useState('');
  const [linkValid, setLinkValid] = useState(false);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState('');
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  function showAlert() {
    Swal.fire({
      title: 'Approval Sent!',
      text: 'A copy of the form has been sent to your email.',
      icon: 'success',
      confirmButtonText: 'Continue',
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post("http://localhost:3001/markupdation", {
        name: `${user.first} ${user.last}`,
        sec: user.sec,
        year: user.year,
        dept: user.dept,
        Email: user.Email,
        courseTitle: selectedCourseTitle,
        grade,
        mark,
        courseLink,
      });
      await showAlert();
      navigate('../home');
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Submission Error',
        text: 'There was an error submitting your form. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    setStoredMail(user.Email);
    if (!storedMail) return;
    const fetchDetails = async () => {
      try {
        const response = await axios.get('http://localhost:3001/detailsUpdate', {
          params: { Email: storedMail },
        });
        setDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching details:', error);
        setError('Error fetching details');
        setLoading(false);
      }
    };
    fetchDetails();
  }, [storedMail]);

  useEffect(() => {
    if (details.length > 0) {
      const titles = details.map((detail) => detail.courseTitle);
      setCourseTitles(titles);
    }
  }, [details]);

  const validateURL = (url) => {
    const urlPattern = /^https:\/\/archive\.nptel\.ac\.in\/content\/noc\/NOC\d+\/SEM\d+\/Ecertificates\/\d+\/noc\d+-cs\d+\/Course\/NPTEL\d+CS\d+S\d+\.(pdf|jpg)$/;
    return urlPattern.test(url);
  };

  const handleMarkChange = (e) => {
    const newMark = e.target.value;
    setMark(newMark);
    setGrade(calculateGrade(newMark));
  };

  const handleLinkChange = (e) => {
    const newLink = e.target.value;
    setCourseLink(newLink);
    setLinkValid(validateURL(newLink));
  };

  const handleCourseChange = (e) => {
    setSelectedCourseTitle(e.target.value);
  };

  const calculateGrade = (mark) => {
    let grade = '';
    if (mark > 100) {
      grade = 'Invalid';
    } else if (mark >= 90) {
      grade = 'O';
    } else if (mark >= 80) {
      grade = 'A+';
    } else if (mark >= 70) {
      grade = 'A';
    } else if (mark >= 60) {
      grade = 'B+';
    } else if (mark >= 50) {
      grade = 'B';
    } else {
      grade = 'F';
    }
    return grade;
  };

  const isFormValid = () => {
    return checkboxChecked && linkValid && !submitting;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 to-green-400 flex flex-col items-center justify-center p-4">
      <div className="bg-green-200/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 mt-14 md:p-12">
        <div className="text-green-800 text-4xl font-bold mb-8 text-center">
          Mark Updation Form
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-lg font-semibold mb-2" htmlFor="courseTitle">
              <FaBook className="inline-block mr-2 text-green-500"/> Course Title:<span className="text-red-500">*</span>
            </label>
            <select
              id="courseTitle"
              className="border-2 border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
              value={selectedCourseTitle}
              onChange={handleCourseChange}
              required
            >
              <option value="" disabled hidden>
                Select Course Title
              </option>
              {courseTitles.map((title, index) => (
                <option key={index} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-semibold mb-2" htmlFor="mark">
                <FaStar className="inline-block mr-2 text-green-500"/> Obtained Mark:<span className="text-red-500">*</span>
              </label>
              <input
                id="mark"
                type="number"
                max="100"
                min="0"
                className="border-2 border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                placeholder="Enter the obtained mark"
                value={mark}
                onChange={handleMarkChange}
                required
              />
            </div>
            <div>
              <label className="block text-lg font-semibold mb-2" htmlFor="grade">
                <FaCheckCircle className="inline-block mr-2 text-green-500"/> Grade:<span className="text-red-500">*</span>
              </label>
              <input
                id="grade"
                type="text"
                className="border-2 border-gray-300 rounded-lg p-3 w-full bg-gray-100 focus:outline-none"
                placeholder="Grade"
                value={grade}
                readOnly
              />
            </div>
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2" htmlFor="courseLink">
              <FaLink className="inline-block mr-2 text-green-500"/> Certificate Link:<span className="text-red-500">*</span>
              <button>
              <Link to = '../help' className=" ml-44 mb-8 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 md:px-6 rounded-full shadow-md transition-all duration-300 transform hover:-translate-y-1 text-sm md:text-base"
          >Help?</Link>
              </button>
            </label>
            <input
              id="courseLink"
              type="text"
              className="border-2 border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
              placeholder="Paste the above copied link here"
              value={courseLink}
              onChange={handleLinkChange}
              required
            />
            {!linkValid && courseLink && (
              <p className="text-red-500 mt-2">Invalid URL. Please enter a valid NPTEL URL.</p>
            )}
          </div>

          <div className="flex items-center mb-8">
            <input
              type="checkbox"
              id="undertaken"
              className="mr-2"
              checked={checkboxChecked}
              onChange={(e) => setCheckboxChecked(e.target.checked)}
            />
            <label htmlFor="undertaken" className="text-lg font-semibold">
              I confirm that the marks I have updated are correct.
            </label>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className={`py-3 px-6 rounded-lg font-semibold text-white transition duration-200 ${
                !isFormValid() ? 'bg-gray-400 cursor-not-allowed opacity-50' : 'bg-green-600 hover:bg-green-700'
              }`}
              disabled={submitting || !isFormValid()}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

Undertaking.propTypes = {
  user: PropTypes.shape({
    first: PropTypes.string.isRequired,
    last: PropTypes.string.isRequired,
    sec: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    dept: PropTypes.string.isRequired,
    Email: PropTypes.string.isRequired,
  }).isRequired,
};

export default Undertaking;
