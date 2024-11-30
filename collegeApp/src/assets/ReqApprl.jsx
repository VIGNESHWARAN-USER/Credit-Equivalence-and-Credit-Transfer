import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const ReqApprl = ({ dept, year, sec }) => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storedyear, setStoredyear] = useState(year);
  const [storeddept, setStoreddept] = useState(dept);
  const [storedsec, setStoredsec] = useState(sec);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setStoredyear(user.year);
      setStoreddept(user.dept);
      setStoredsec(user.sec);
    }
  }, [dept, year, sec]);

  useEffect(() => {
    if (!storedyear) return;

    const fetchDetails = async () => {
      try {
        const response = await axios.get('http://localhost:3001/detailsca', {
          params: {
            year: storedyear,
            dept: storeddept,
            sec: storedsec,
          },
        });
        setDetails(response.data);
        localStorage.setItem('details', JSON.stringify(response.data));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching details:', error);
        setError('Error fetching details');
        setLoading(false);
      }
    };

    fetchDetails();
  }, [storedyear, storeddept, storedsec]);

  const handleViewApproved = () => {
    navigate('/approvedstud');
  };

  const handleViewRejected = () => {
    navigate('/rejectedstud');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-green-700 text-2xl animate-pulse">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-green-700 text-2xl">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 to-green-400 flex flex-col items-center justify-center p-4">
      <div className="max-w-7xl mx-auto w-full">
        <div className="bg-green-200/80 backdrop-blur-lg mt-14 rounded-2xl shadow-lg p-4 md:p-8">
          <h1 className="text-3xl md:text-5xl font-bold text-green-900 text-center mb-10">
            Course Approval Form
          </h1>

          <div className="flex flex-col md:flex-row justify-between mb-8 space-y-4 md:space-y-0">
            <button
              onClick={handleViewApproved}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-full shadow-md transition-all duration-300 transform hover:-translate-y-1 w-full md:w-auto"
            >
              View Approved Records
            </button>
            <button
              onClick={handleViewRejected}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-full shadow-md transition-all duration-300 transform hover:-translate-y-1 w-full md:w-auto"
            >
              View Rejected Records
            </button>
          </div>

          <div className="overflow-x-auto shadow-lg rounded-lg w-full">
            <table className="w-full border-collapse bg-green-100/70 backdrop-blur-lg rounded-lg">
              <thead>
                <tr className="bg-green-600 text-white text-left">
                  <th className="py-4 px-3 sm:px-6 text-xs sm:text-sm md:text-base font-semibold">Candidate Name</th>
                  <th className="py-4 px-3 sm:px-6 text-xs sm:text-sm md:text-base font-semibold">Register Number</th>
                  <th className="py-4 px-3 sm:px-6 text-xs sm:text-sm md:text-base font-semibold">Course Name</th>
                  <th className="py-4 px-3 sm:px-6 text-xs sm:text-sm md:text-base font-semibold">Credits</th>
                  <th className="py-4 px-3 sm:px-6 text-xs sm:text-sm md:text-base font-semibold">Status</th>
                  <th className="py-4 px-3 sm:px-6 text-xs sm:text-sm md:text-base font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {details.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-6 text-green-700 text-center text-sm sm:text-lg font-bold">
                      NO RECORDS FOUND
                    </td>
                  </tr>
                ) : (
                  details.map((detail) => (
                    <tr key={detail._id} className="hover:bg-green-100 transition-all duration-200">
                      <td className="py-4 px-3 sm:px-6 text-xs sm:text-sm md:text-base">{detail.name}</td>
                      <td className="py-4 px-3 sm:px-6 text-xs sm:text-sm md:text-base">{detail.roll}</td>
                      <td className="py-4 px-3 sm:px-6 text-xs sm:text-sm md:text-base">{detail.courseTitle}</td>
                      <td className="py-4 px-3 sm:px-6 text-xs sm:text-sm md:text-base">{detail.credits}</td>
                      <td className={`py-4 px-3 sm:px-6 text-xs sm:text-sm md:text-base font-semibold ${detail.status === 'Approved' ? 'text-green-700' : 'text-red-700'}`}>
                        {detail.status === 'Approved' ? <FaCheckCircle className="inline-block mr-1"/> : <FaTimesCircle className="inline-block mr-1"/>}
                        {detail.status}
                      </td>
                      <td className="py-4 px-3 sm:px-6 text-center">
                        <button
                          onClick={() => navigate('/preview', { state: { detail } })}
                          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-300 transform hover:-translate-y-1 text-xs md:text-sm"
                        >
                          OPEN
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

ReqApprl.propTypes = {
  year: PropTypes.string.isRequired,
  dept: PropTypes.string.isRequired,
  sec: PropTypes.string.isRequired,
};

export default ReqApprl;
