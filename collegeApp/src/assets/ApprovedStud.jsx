import { useEffect, useState } from 'react';
import axios from 'axios';

const ApprovedStud = () => {
  const [role, setRole] = useState("");
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setRole(user.role);
    }
  }, []);

  useEffect(() => {
    if (!role) return;
    const fetchDetails = async () => {
      try 
      {
        const endpoint = 'http://localhost:3001/detailsapproved';
        const response = await axios.get(endpoint, {
          params: {
            role: role, 
            user: JSON.parse(localStorage.getItem('user')),
          }
        });
        setDetails(response.data);
        localStorage.setItem('details', JSON.stringify(response.data));
        setLoading(false);
      } 
      catch (error) 
      {
        console.error('Error fetching details:', error);
        setError('Error fetching details');
        setLoading(false);
      }
    };
    fetchDetails();
  }, [role]);

  const handleDelete = async () => {
    try 
    {
      const response = await axios.post(`http://localhost:3001/deletedetails?role=${role}`);
      if (response.data.message) {
        setDetails([]); 
        console.log(response.data.message);
      }
    } 
    catch (err) 
    {
      console.error("Error Occured:", err);
    }
  };

  if (loading) 
  {
    return <div className="flex justify-center items-center h-screen text-green-700 text-2xl animate-pulse">Loading...</div>;
  }

  if (error) 
  {
    return <div className="flex justify-center items-center h-screen text-green-700 text-2xl">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 to-green-400 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="bg-green-200/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 md:p-12 w-full">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-green-900 text-center">
              Approved Records
            </h1>
            <button 
              onClick={handleDelete} 
              className="bg-green-600 mt-4 md:mt-0 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-300 transform hover:-translate-y-1 text-sm md:text-base"
            >
              Delete All Records
            </button>
          </div>
          <div className="overflow-x-auto shadow-lg rounded-lg w-full">
            <table className="w-full border-collapse bg-green-100/70 backdrop-blur-lg rounded-lg">
              <thead>
                <tr className="bg-green-600 text-white text-left text-sm md:text-base">
                  <th className="py-3 px-4 sm:py-4 sm:px-6">Candidate Name</th>
                  <th className="py-3 px-4 sm:py-4 sm:px-6">Register Number</th>
                  <th className="py-3 px-4 sm:py-4 sm:px-6">Course Name</th>
                  <th className="py-3 px-4 sm:py-4 sm:px-6">Credits</th>
                  <th className="py-3 px-4 sm:py-4 sm:px-6">Status</th>
                </tr>
              </thead>
              <tbody>
                {details.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-6 text-green-700 text-center text-lg font-bold">
                      NO RECORDS FOUND
                    </td>
                  </tr>
                  ) : (
                  details.map((student) => (
                    <tr key={student._id} className="hover:bg-green-100 transition-all duration-200">
                      <td className="py-3 px-4 sm:py-4 sm:px-6 text-xs md:text-sm">{student.name}</td>
                      <td className="py-3 px-4 sm:py-4 sm:px-6 text-xs md:text-sm">{student.roll}</td>
                      <td className="py-3 px-4 sm:py-4 sm:px-6 text-xs md:text-sm">{student.courseTitle}</td>
                      <td className="py-3 px-4 sm:py-4 sm:px-6 text-xs md:text-sm">{student.credits}</td>
                      <td className="py-3 px-4 sm:py-4 sm:px-6 text-xs md:text-sm">{student.status}</td>
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

export default ApprovedStud;
