import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Preview = () => {
  const location = useLocation();
  const initialDetail = location.state?.detail || {};
  const [currentDetail, setCurrentDetail] = useState(initialDetail);
  const [userrole, setuserrole] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const storedDetails = JSON.parse(localStorage.getItem('details'));
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) 
    {
      setuserrole(user.role);
    }
    if (storedDetails) 
    {
      const updatedDetail = storedDetails.find(item => item._id === initialDetail._id);
      if (updatedDetail) 
      {
        setCurrentDetail(updatedDetail);
      }
    }
  }, [initialDetail._id]);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const showAlert = () => {
    Swal.fire({
      title: 'Approved!',
      text: userrole === 'dir' ? 'Mail sent to the candidate' : 'The status field will remain in Pending until CDDA Approves',
      icon: 'success',
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'bg-green-600 text-white rounded-md px-4 py-2',
      },
    });
  };

  const showAlert1 = () => {
    Swal.fire({
      title: 'Rejected successfully',
      text: 'Mail sent to the candidate',
      icon: 'info',
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'bg-green-600 text-white rounded-md px-4 py-2',
      },
    });
  };

  const updateLocalStorage = (id, status) => {
    const storedDetails = JSON.parse(localStorage.getItem('details'));
    const updatedDetails = storedDetails.map(item =>
      item._id === id ? { ...item, status } : item
    );
    localStorage.setItem('details', JSON.stringify(updatedDetails));
  };

  const handleApprove = async (id, Email) => {
    setLoading('approve');
    try 
    {
      const endpoint = userrole === 'ca' ? 'approveca' : userrole === 'hod' ? 'approvehod' : 'approve';
      const status = userrole === 'dir' ? 'Approved' : 'Pending';
      await axios.post(`http://localhost:3001/${endpoint}`, { id, Email });
      const updatedDetail = { ...currentDetail, status };
      setCurrentDetail(updatedDetail);
      updateLocalStorage(id, status);
      showAlert();
      navigate(-1);
    } 
    catch (error) 
    {
      console.error('Error approving detail:', error);
    } 
    finally 
    {
      setLoading(null);
    }
  };

  const handleReject = async (id, Email) => {
    setLoading('reject');
    try 
    {
      const endpoint = userrole === 'ca' ? 'rejectca' : userrole === 'hod' ? 'rejecthod' : 'reject';
      await axios.post(`http://localhost:3001/${endpoint}`, { id, Email });
      const updatedDetail = { ...currentDetail, status: 'Rejected' };
      setCurrentDetail(updatedDetail);
      updateLocalStorage(id, 'Rejected');
      showAlert1();
      navigate(-1);
    } 
    catch (error) 
    {
      console.error('Error rejecting detail:', error);
    } 
    finally 
    {
      setLoading(null);
    }
  };

  if (!currentDetail) 
  {
    return <p className="text-center text-green-700 text-xl mt-8">No detail found</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b mt-14 from-green-200 to-green-400 p-4">
      <div className="text-center">
        <h1 className="text-green-700 text-3xl md:text-5xl font-bold mb-6">Candidate Information</h1>
        <hr className="border-t-2 border-green-600 mb-8" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: 'Candidate Name:', value: currentDetail.name },
          { label: 'Candidate Roll no:', value: currentDetail.roll || 'Not Set' },
          { label: 'Candidate Year:', value: currentDetail.year },
          { label: 'Candidate Department:', value: currentDetail.dept },
          { label: 'Candidate Section:', value: currentDetail.sec },
        ].map((item, index) => (
          <div key={index} className="p-4 bg-green-50 border-l-4 border-green-600 shadow-sm rounded-lg">
            <h2 className="text-green-800 font-semibold text-lg mb-2">{item.label}</h2>
            <p className="text-green-900 font-medium text-base">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="text-center">
        <h1 className="text-green-700 text-3xl md:text-5xl font-bold mb-6">Course Information</h1>
        <hr className="border-t-2 border-green-600 mb-8" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Course Name:', value: currentDetail.courseTitle },
          { label: 'Offered By:', value: currentDetail.offeredBy },
          { label: 'Mode Of Study:', value: currentDetail.modeOfStudy },
          { label: 'Duration in Weeks:', value: currentDetail.duration },
          { label: 'Credits:', value: currentDetail.credits },
          { label: 'Assessment Method:', value: currentDetail.assessmentMethod },
          { label: 'Status:', value: currentDetail.status },
        ].map((item, index) => (
          <div key={index} className="p-4 bg-green-50 border-l-4 border-green-600 shadow-sm rounded-lg">
            <h2 className="text-green-800 font-semibold text-lg mb-2">{item.label}</h2>
            <p className="text-green-900 font-medium text-base">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <a
          className="font-medium text-blue-800 text-lg block mt-4"
          target='_blank'
          rel='noopener noreferrer'
          href={`https://onlinecourses.nptel.ac.in/${currentDetail.courseCode}/preview`}
        >
          Go to Syllabus
        </a>
      </div>
        <div className="mt-12">
          <div className='flex items-center mb-6'>
            <input
              className='mr-3 w-5 h-5 accent-green-600'
              type='checkbox'
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            <p className='text-green-800 font-semibold text-lg'>This course does not match with the curriculum</p>
          </div>
          <div className="text-center">
            <p className="text-green-700 text-lg font-semibold mb-6">
              If the candidate is eligible for approval, Submit and Forward. Else Reject.
            </p>
            <div className="flex justify-center space-x-6">
              <button
                onClick={() => handleApprove(currentDetail._id, currentDetail.Email)}
                className={`text-lg px-6 py-3 rounded-lg transition-all duration-300 ${isChecked ? 'bg-green-700 hover:bg-green-800 text-white shadow-md' : 'bg-gray-500 text-gray-300 cursor-not-allowed'}`}
                disabled={!isChecked || loading === 'approve'}
              >
                {loading === 'approve' ? 'Approving...' : 'Approve & Forward'}
              </button>
              <button
                onClick={() => handleReject(currentDetail._id, currentDetail.Email)}
                className={`text-lg px-6 py-3 rounded-lg transition-all duration-300 bg-red-700 hover:bg-red-800 text-white shadow-md ${loading === 'reject' && 'opacity-50 cursor-not-allowed'}`}
                disabled={loading === 'reject'}
              >
                {loading === 'reject' ? 'Rejecting...' : 'Reject & Notify'}
              </button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Preview;
