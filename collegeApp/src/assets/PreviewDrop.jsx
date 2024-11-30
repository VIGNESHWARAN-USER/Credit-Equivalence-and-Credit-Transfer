import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const PreviewDrop = () => {
  const location = useLocation();
  const initialDetail = location.state?.detail || {};
  const [currentDetail, setCurrentDetail] = useState(initialDetail);
  const [userrole, setUserRole] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
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

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  function showAlert(message, icon = 'success') {
    Swal.fire({
      title: icon === 'success' ? 'Approved!' : 'Rejected successfully',
      text: message,
      icon: icon,
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'bg-green-600 text-white rounded-md px-4 py-2',
      }
    });
  }

  const updateLocalStorage = (id, status) => {
    const stogreenDetails = JSON.parse(localStorage.getItem('details'));
    const updatedDetails = stogreenDetails.map(item =>
      item._id === id ? { ...item, status } : item
    );
    localStorage.setItem('details', JSON.stringify(updatedDetails));
  };

  const handleApprove = async (id, Email) => {
    try {
      setLoadingApprove(true);
      const endpoint = userrole === 'ca' ? `dropca` : userrole === 'hod' ? `drophod` : `dropcourse`;
      const status = userrole === 'dir' ? 'Approved' : 'Pending';
      await axios.post(`http://localhost:3001/${endpoint}`, { id, Email });
      const updatedDetail = { ...currentDetail, status };
      setCurrentDetail(updatedDetail);
      updateLocalStorage(id, status);
      showAlert(userrole === 'dir' ? 'Mail sent to the candidate' : 'The status field will remain in Pending until CDDA Approves');
      navigate(-1);
    } catch (error) {
      console.error('Error approving detail:', error);
    } finally {
      setLoadingApprove(false);
    }
  };

  const handleReject = async (id, Email) => {
    try {
      setLoadingReject(true);
      const endpoint = userrole === 'ca' ? `rejectsca` : userrole === 'hod' ? `rejectshod` : `rejects`;
      await axios.post(`http://localhost:3001/${endpoint}`, { id, Email });
      const updatedDetail = { ...currentDetail, status: 'Rejected' };
      setCurrentDetail(updatedDetail);
      updateLocalStorage(id, 'Rejected');
      showAlert('Mail sent to the candidate', 'info');
      navigate(-1);
    } catch (error) {
      console.error('Error rejecting detail:', error);
    } finally {
      setLoadingReject(false);
    }
  };

  if (!currentDetail) {
    return <p className="text-center text-green-700 text-xl mt-8">No detail found</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b mt-14 from-green-200 to-green-400 p-4">
      <div className="text-center">
        <h1 className="text-green-700 text-3xl md:text-5xl font-bold mb-6">Candidate & Course Information</h1>
        <hr className="border-t-2 border-green-600 mb-8" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: 'Candidate Name:', value: currentDetail.name },
          { label: 'Candidate Roll no:', value: 'Not Set' },
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
        <h1 className="text-green-700 text-3xl md:text-5xl font-bold mb-6">Course Details</h1>
        <hr className="border-t-2 border-green-600 mb-8" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Course Name:', value: currentDetail.courseName },
          { label: 'Course Code:', value: currentDetail.courseCode },
          { label: 'Category:', value: currentDetail.category },
          { label: 'Semester:', value: currentDetail.semester },
        ].map((item, index) => (
          <div key={index} className="p-4 bg-green-50 border-l-4 border-green-600 shadow-sm rounded-lg">
            <h2 className="text-green-800 font-semibold text-lg mb-2">{item.label}</h2>
            <p className="text-green-900 font-medium text-base">{item.value}</p>
          </div>
        ))}
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
                disabled={!isChecked || loadingApprove}
              >
                {loadingApprove ? 'Approving...' : 'Approve & Forward'}
              </button>
              <button
                onClick={() => handleReject(currentDetail._id, currentDetail.Email)}
                className={`text-lg px-6 py-3 rounded-lg transition-all duration-300 bg-red-700 hover:bg-red-800 text-white shadow-md ${loadingReject && 'opacity-50 cursor-not-allowed'}`}
                disabled={loadingReject}
              >
                {loadingReject ? 'Rejecting...' : 'Reject & Notify'}
              </button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default PreviewDrop;
