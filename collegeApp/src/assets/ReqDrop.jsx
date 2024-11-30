import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const ReqDrop = ({ dept, year, sec }) => {
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
        const response = await axios.get('http://localhost:3001/dropsca', {
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
    navigate('/approvedstuddrop');
  };

  const handleViewRejected = () => {
    navigate('/rejectedstuddrop');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-700 text-2xl animate-pulse">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-700 text-2xl">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 to-green-400 flex flex-col items-center justify-center p-4">
      <div className="max-w-7xl mx-auto w-full">
        <div className="bg-green-200/80 backdrop-blur-lg mt-14 rounded-2xl shadow-lg p-4 md:p-8">
          <h1 className="text-2xl md:text-4xl font-bold text-green-900 text-center mb-6 md:mb-8">
            Course Drop Form
          </h1>
          <hr className="mb-6 border-2 border-green-800" />

          <div className="mb-6 flex flex-col md:flex-row justify-center md:justify-start space-y-4 md:space-y-0 md:space-x-4">
            <button
              onClick={handleViewApproved}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 md:px-6 rounded-full shadow-md transition-all duration-300 transform hover:-translate-y-1 text-sm md:text-base"
            >
              View Approved Records
            </button>
            <button
              onClick={handleViewRejected}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 md:px-6 rounded-full shadow-md transition-all duration-300 transform hover:-translate-y-1 text-sm md:text-base"
            >
              View Rejected Records
            </button>
          </div>

          <div className="overflow-x-auto shadow-lg rounded-lg">
            <table className="min-w-full border-collapse bg-green-100/70 backdrop-blur-lg rounded-lg">
              <thead className="bg-green-600 text-white text-left">
                <tr>
                  <th className="py-3 px-4 md:px-6 text-sm md:text-base font-semibold">Candidate Name</th>
                  <th className="py-3 px-4 md:px-6 text-sm md:text-base font-semibold">Register Number</th>
                  <th className="py-3 px-4 md:px-6 text-sm md:text-base font-semibold">Course Name</th>
                  <th className="py-3 px-4 md:px-6 text-sm md:text-base font-semibold">Credits</th>
                  <th className="py-3 px-4 md:px-6 text-sm md:text-base font-semibold">Status</th>
                  <th className="py-3 px-4 md:px-6 text-sm md:text-base font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {details.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-6 text-green-700 text-center text-lg font-bold">
                      NO RECORDS FOUND
                    </td>
                  </tr>
                ) : (
                  details.map((detail) => (
                    <tr key={detail._id} className="hover:bg-green-100 transition-all duration-200">
                      <td className="py-3 px-4 md:px-6 text-xs md:text-sm">{detail.name}</td>
                      <td className="py-3 px-4 md:px-6 text-xs md:text-sm">{detail.roll}</td>
                      <td className="py-3 px-4 md:px-6 text-xs md:text-sm">{detail.courseName}</td>
                      <td className="py-3 px-4 md:px-6 text-xs md:text-sm">{detail.credits}</td>
                      <td className="py-3 px-4 md:px-6 text-xs md:text-sm">{detail.status}</td>
                      <td className="py-3 px-4 md:px-6 text-center">
                        <button
                          onClick={() => navigate('/droppreview', { state: { detail } })}
                          className="bg-green-700 rounded-lg py-1 px-2 md:py-2 md:px-4 text-white hover:bg-green-900 text-xs md:text-sm transition duration-300"
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

ReqDrop.propTypes = {
  year: PropTypes.string.isRequired,
  dept: PropTypes.string.isRequired,
  sec: PropTypes.string.isRequired,
};

export default ReqDrop;
