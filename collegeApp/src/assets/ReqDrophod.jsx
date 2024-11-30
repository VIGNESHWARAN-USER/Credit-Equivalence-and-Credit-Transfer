import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ReqDrophod = ({ dept }) => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(null);
  const [error, setError] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [storedDept, setStoredDept] = useState(dept);
  const navigate = useNavigate();

  function showAlert() {
    Swal.fire({
      title: 'Approval is Done!',
      text: 'You can check the records in Approved Records',
      icon: 'success',
      confirmButtonText: 'OK',
    });
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setStoredDept(user.dept);
    }
  }, [dept]);

  useEffect(() => {
    if (!storedDept) return;

    const fetchDetails = async () => {
      try {
        const response = await axios.get('http://localhost:3001/dropshod', {
          params: {
            dept: storedDept,
            ca: 'yes',
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
  }, [storedDept]);

  useEffect(() => {
    if (selectAll) {
      setSelectedDetails(details.map((detail) => detail._id));
    } else {
      setSelectedDetails([]);
    }
  }, [selectAll, details]);

  const handleSelectDetail = (id) => {
    if (selectedDetails.includes(id)) {
      setSelectedDetails(selectedDetails.filter((detailId) => detailId !== id));
    } else {
      setSelectedDetails([...selectedDetails, id]);
    }
  };

  const handleApproveAll = async () => {
    try {
      setLoading1('approve')
      await axios.post('http://localhost:3001/approveallhoddrop', { ids: selectedDetails });
      showAlert();
    } catch (error) {
      console.error('Error approving details:', error);
    }finally{
      setLoading1(null)
    }
  };

  const handleViewApproved = () => {
    navigate('/approvedstuddrop');
  };

  const handleViewRejected = () => {
    navigate('/rejectedstuddrop');
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
        <div className="bg-green-200/80 backdrop-blur-lg rounded-2xl shadow-lg p-4 md:p-8">
          <h1 className="text-2xl md:text-4xl font-bold text-green-900 text-center mb-6 md:mb-10">
            Course Drop Form
          </h1>

          <div className="flex flex-col md:flex-row justify-between mb-6 md:mb-8 space-y-4 md:space-y-0 md:space-x-4">
            <button
              onClick={handleViewApproved}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 md:py-2 md:px-6 rounded-full shadow-md transition-all duration-300 transform hover:-translate-y-1 text-sm md:text-base"
            >
              View Approved Records
            </button>
            <button
              onClick={handleViewRejected}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 md:py-2 md:px-6 rounded-full shadow-md transition-all duration-300 transform hover:-translate-y-1 text-sm md:text-base"
            >
              View Rejected Records
            </button>
          </div>

          <div className="overflow-x-auto shadow-lg rounded-lg">
            <table className="min-w-full border-collapse bg-green-100/70 backdrop-blur-lg rounded-lg">
              <thead>
                <tr className="bg-green-600 text-white text-left">
                  <th className="py-3 px-4 md:px-6 text-xs md:text-sm font-semibold">
                    <span className="mr-2">Select All</span>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={() => setSelectAll(!selectAll)}
                    />
                  </th>
                  <th className="py-3 px-4 md:px-6 text-xs md:text-sm font-semibold">Candidate Name</th>
                  <th className="py-3 px-4 md:px-6 text-xs md:text-sm font-semibold">Course Name</th>
                  <th className="py-3 px-4 md:px-6 text-xs md:text-sm font-semibold">Credits</th>
                  <th className="py-3 px-4 md:px-6 text-xs md:text-sm font-semibold">Status</th>
                  <th className="py-3 px-4 md:px-6 text-xs md:text-sm font-semibold text-center">Actions</th>
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
                      <td className="py-3 px-4 md:px-6 text-xs md:text-sm">
                        <input
                          type="checkbox"
                          checked={selectedDetails.includes(detail._id)}
                          onChange={() => handleSelectDetail(detail._id)}
                        />
                      </td>
                      <td className="py-3 px-4 md:px-6 text-xs md:text-sm">{detail.name}</td>
                      <td className="py-3 px-4 md:px-6 text-xs md:text-sm">{detail.courseName}</td>
                      <td className="py-3 px-4 md:px-6 text-xs md:text-sm">{detail.credits}</td>
                      <td className={`py-3 px-4 md:px-6 text-xs md:text-sm font-semibold ${detail.status === 'Approved' ? 'text-green-700' : 'text-red-700'}`}>
                        {detail.status}
                      </td>
                      <td className="py-3 px-4 md:px-6 text-center">
                        <button
                          onClick={() => navigate('/droppreview', { state: { detail } })}
                          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-2 md:py-2 md:px-4 rounded-full shadow-md transition-all duration-300 transform hover:-translate-y-1 text-xs md:text-sm"
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

          <button
            onClick={handleApproveAll}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 md:py-2 md:px-6 mt-8 rounded-full shadow-md transition-all duration-300 transform hover:-translate-y-1 text-sm md:text-base"
            disabled={selectedDetails.length === 0}
          >
            {loading1 === 'approve' ? 'Approving...' : 'Approve All'}
          </button>
        </div>
      </div>
    </div>
  );
};

ReqDrophod.propTypes = {
  dept: PropTypes.string.isRequired,
};

export default ReqDrophod;
