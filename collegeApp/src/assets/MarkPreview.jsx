import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const MarkPreview = () => {
  const location = useLocation();
  const initialDetail = location.state?.detail || {};
  const [currentDetail, setCurrentDetail] = useState(initialDetail);
  const [userrole, setUserRole] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stogreenDetails = JSON.parse(localStorage.getItem('details'));
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserRole(user.role);
    }
    if (stogreenDetails) {
      const updatedDetail = stogreenDetails.find(item => item._id === initialDetail._id);
      if (updatedDetail) {
        setCurrentDetail(updatedDetail);
      }
    }
  }, [initialDetail._id]);

  const handleCheckboxChange = event => {
    setIsChecked(event.target.checked);
  };

  const showAlert = (title, text, icon) => {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: 'OK'
    });
  };

  const updateLocalStorage = (id, status) => {
    const stogreenDetails = JSON.parse(localStorage.getItem('details'));
    const updatedDetails = stogreenDetails.map(item =>
      item._id === id ? { ...item, status } : item
    );
    localStorage.setItem('details', JSON.stringify(updatedDetails));
  };

  const handleApprove = async (id, Email) => {
    try 
    {
      setApproving(true); // Start loading state
  
      await axios.post(`http://localhost:3001/approvemark`, { id, Email });
  
      const updatedDetail = { ...currentDetail, status: 'Approved' };
      setCurrentDetail(updatedDetail);
      updateLocalStorage(id, 'Approved');
      showAlert('Approved!', 'Mail sent to the candidate', 'success');
      navigate(-1);
    } 
    catch (error) 
    {
      console.error('Error approving detail:', error);
    } 
    finally 
    {
      setApproving(false); // End loading state
    }
  };
  const handleReject = async (id, Email) => {
    try 
    {
      setRejecting(true); // Start loading state
  
      await axios.post(`http://localhost:3001/reject`, { id, Email });
  
      const updatedDetail = { ...currentDetail, status: 'Rejected' };
      setCurrentDetail(updatedDetail);
      updateLocalStorage(id, 'Rejected');
      showAlert('Rejected successfully', 'Mail sent to the candidate', 'info');
      navigate(-1);
    } 
    catch (error) 
    {
      console.error('Error rejecting detail:', error);
    } 
    finally 
    {
      setRejecting(false); // End loading state
    }
  };
  
  if (!currentDetail) 
  {
    return <p>No detail found</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b mt-14 from-green-200 to-green-400 p-4">
      <div className="text-center">
        <h1 className="text-green-700 text-3xl md:text-5xl font-bold mb-6">Candidate Information</h1>
        <hr className="border-1 border-green-800 mb-4" />
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
          <div className="text-green-900 font-medium text-base">
            {item.value}
          </div>
        </div>
        ))}
      </div>
      <div className="text-center mt-8">
        <h1 className="text-green-800 text-2xl md:text-4xl font-bold mb-6">Course Information</h1>
        <hr className="border-1 border-green-800 mb-4" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
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
            <div className="text-green-900 font-medium text-base">
              {item.value}
            </div>
          </div>
        ))}
        <div className="w-full px-3 mt-6">
          <a 
            className="font-medium text-blue-800 text-lg" 
            target='_blank' 
            href={currentDetail.courseLink}
          >
            View Certificate
          </a>
        </div>
      </div>
      {userrole !== 'dir' && (
        <div className="mt-8">
          <div className="flex items-center mb-4">
            <input
              className="me-2"
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            <p className="text-green-800">The certificate details are verified.</p>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => handleApprove(currentDetail._id, currentDetail.Email)}
              className={`text-sm px-6 py-2 rounded-lg ${isChecked ? 'bg-green-800 text-white' : 'bg-gray-500 text-gray-300'}`}
              disabled={!isChecked || approving}
            >
              {approving ? 'Approving...' : 'Approve & Forward'}
            </button>
            <button
                onClick={() => handleReject(currentDetail._id, currentDetail.Email)}
                className={`text-sm px-6 py-2 rounded-lg bg-green-700 text-white`}
                disabled={rejecting}
              >
              {rejecting ? 'Rejecting...' : 'Reject & Notify'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkPreview;
