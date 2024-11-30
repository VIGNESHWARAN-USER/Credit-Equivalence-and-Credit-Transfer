import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import { RiErrorWarningFill } from "react-icons/ri";

const Forms = ({ mail }) => {
  const [details1, setDetails1] = useState([]);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storedMail, setStoredMail] = useState(mail);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setStoredMail(user.Email);
    }
  }, [mail]);

  useEffect(() => {
    if (!storedMail) return;

    const fetchDetails = async () => {
      try {
        const response = await axios.get('http://localhost:3001/details', {
          params: { Email: storedMail },
        });
        const response1 = await axios.get('http://localhost:3001/details1', {
          params: { Email: storedMail },
        });
        setDetails(response.data);
        setDetails1(response1.data)
        setLoading(false);
      } catch (error) {
        console.error('Error fetching details:', error);
        setError('Error fetching details');
        setLoading(false);
      }
    };

    fetchDetails();
  }, [storedMail]);

  if (loading) 
  {
      return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-green-300 to-blue-200">
          <p className="text-lg text-gray-700">Loading...</p>
        </div>
      );
  }

  if (error) 
  {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-green-300 to-blue-200">
        <p className="text-lg text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 to-green-400 flex flex-col items-center justify-center p-4">
      <div className="container mx-auto py-8 px-4 md:px-8">
        <div className="text-center text-green-800 text-4xl font-bold mb-6">
          Course Approval Form
        </div>
        <hr className="mb-6 border-2 border-green-800" />
        <div className="space-y-8">
          {details.map((detail) => (
            <div key={detail._id} className="bg-green-200/80 backdrop-blur-lg rounded-2xl shadow-lg p-5 md:p-5">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex-1 mb-4 md:mb-0">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{detail.courseTitle}</h2>
                  <p className="text-gray-700">{detail.status}</p>
                </div>
                <div className="flex flex-wrap flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8">
                  <div className="flex items-center">
                    {(detail.status === 'Mark Verification' || detail.ca === 'yes') && <IoCheckmarkDoneCircle className="text-green-600" />}
                    {detail.ca === 'no' && detail.status === 'Rejected' && <MdCancel className="text-red-600" />}
                    {detail.ca === 'no' && detail.status === 'Pending' && <RiErrorWarningFill className="text-orange-600" />}
                    <p className="ml-2 text-gray-700">CA</p>
                  </div>
                  <div className="flex items-center">
                    {detail.hod === 'yes' && <IoCheckmarkDoneCircle className="text-green-600" />}
                    {detail.hod === 'no' && detail.status === 'Rejected' && <MdCancel className="text-red-600" />}
                    {detail.hod === 'no' && detail.status === 'Pending' && <RiErrorWarningFill className="text-orange-600" />}
                    <p className="ml-2 text-gray-700">HOD</p>
                  </div>
                  <div className="flex items-center">
                    {detail.dir === 'yes' && <IoCheckmarkDoneCircle className="text-green-600" />}
                    {detail.dir === 'no' && detail.status === 'Rejected' && <MdCancel className="text-red-600" />}
                    {detail.dir === 'no' && detail.status === 'Pending' && <RiErrorWarningFill className="text-orange-600" />}
                    <p className="ml-2 text-gray-700">CDDA</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="container mx-auto py-8 px-4 md:px-8">
        <div className="text-center text-green-800 text-4xl font-bold mb-6">
          Mark Updation Form
        </div>
        <hr className="mb-6 border-2 border-green-800" />
        <div className="space-y-8">
          {details.map((detail) => (
            (detail.status === 'Mark Verification') && (
              <div key={detail._id} className="bg-green-200/80 backdrop-blur-lg rounded-2xl shadow-lg p-5 md:p-5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="flex-1 mb-4 md:mb-0">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{detail.courseTitle}</h2>
                    <p className="text-gray-700">{detail.status}</p>
                  </div>
                  <div className="flex flex-wrap flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8">
                    <div className="flex items-center">
                      {(detail.ca === 'yes') && <IoCheckmarkDoneCircle className="text-green-600" />}
                      {detail.ca === 'no' && detail.status === 'Rejected' && <MdCancel className="text-red-600" />}
                      {detail.ca === 'no' && detail.status === 'Mark Verification' && <RiErrorWarningFill className="text-orange-600" />}
                      <p className="ml-2 text-gray-700">CA</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
      <div className="container mx-auto py-8 px-4 md:px-8">
        <div className="text-center text-green-800 text-4xl font-bold mb-6">
          Course Drop Form
        </div>
        <hr className="mb-6 border-2 border-green-800" />
        <div className="space-y-8">
          {details1.map((detail) => (
            <div key={detail._id} className="bg-green-200/80 backdrop-blur-lg rounded-2xl shadow-lg p-5 md:p-5">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex-1 mb-4 md:mb-0">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{detail.courseName}</h2>
                  <p className="text-gray-700">{detail.status}</p>
                </div>
                <div className="flex flex-wrap flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8">
                  <div className="flex items-center">
                    {(detail.status === 'Mark Verification' || detail.ca === 'yes') && <IoCheckmarkDoneCircle className="text-green-600" />}
                    {detail.ca === 'no' && detail.status === 'Rejected' && <MdCancel className="text-red-600" />}
                    {detail.ca === 'no' && detail.status === 'Pending' && <RiErrorWarningFill className="text-orange-600" />}
                    <p className="ml-2 text-gray-700">CA</p>
                  </div>
                  <div className="flex items-center">
                    {detail.hod === 'yes' && <IoCheckmarkDoneCircle className="text-green-600" />}
                    {detail.hod === 'no' && detail.status === 'Rejected' && <MdCancel className="text-red-600" />}
                    {detail.hod === 'no' && detail.status === 'Pending' && <RiErrorWarningFill className="text-orange-600" />}
                    <p className="ml-2 text-gray-700">HOD</p>
                  </div>
                  <div className="flex items-center">
                    {detail.dir === 'yes' && <IoCheckmarkDoneCircle className="text-green-600" />}
                    {detail.dir === 'no' && detail.status === 'Rejected' && <MdCancel className="text-red-600" />}
                    {detail.dir === 'no' && detail.status === 'Pending' && <RiErrorWarningFill className="text-orange-600" />}
                    
                    <p className="ml-2 text-gray-700">CDDA</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

Forms.propTypes = {
  mail: PropTypes.string.isRequired,
};

export default Forms;
