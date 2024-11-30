import axios from "axios";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import PropTypes from 'prop-types';

const Marks = ({user}) => {
  const navigate = useNavigate();
  function showAlert() {
    Swal.fire({
      title: 'Approval Sent!',
      text: 'Copy of the Form is sent to your Email',
      icon: 'success',
      confirmButtonText: 'Continue'
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try 
    {
      const response = await axios.post("http://localhost:3001/mark", {
        name: user.first+" "+user.last,
        sec: user.sec,
        year: user.year,
        dept: user.dept,
        Email: user.Email,
      });
      console.log(response.data);
      await showAlert();
      navigate('../home');
    } 
    catch (error) 
    {
      console.error(error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 to-green-400 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4 text-red-800" style={{ fontFamily: "'Nexa', sans-serif" }}>
        Mark Updation For
      </h1>
      <hr className="mb-2 w-full border-t-2 border-red-800" />
      <div className="flex justify-center items-center w-full">
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 lg:p-20 shadow-lg rounded-lg flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 w-full md:w-auto">
          <div className="flex flex-col md:w-1/2">
            <h2 className="text-xl font-semibold mb-2">Marks:</h2>
            <input type="number" className="p-4 shadow-lg rounded-lg focus:outline-none" style={{ width: '100%' }} placeholder="In Number" required />
          </div>
          <div className="flex flex-col md:w-1/2 md:mt-8 md:ml-auto">
            <h2 className="text-xl font-semibold mb-2">Grade:</h2>
            <select className="p-4 shadow-lg rounded-lg focus:outline-none" style={{ width: '100%', color: 'gray' }} required>
              <option value="" disabled selected hidden>A, A+...</option>
              <option value="A">A</option>
              <option value="A+">A+</option>
              <option value="B">B</option>
              <option value="B+">B+</option>
              <option value="C">C</option>
              <option value="C+">C+</option>
            </select>
          </div>
          <div className="flex justify-center w-full md:w-auto mt-4">
            <button type="submit" className="bg-red-800 text-white font-semibold py-2 px-6 shadow-lg hover:bg-red-700 focus:bg-red-700 rounded-lg">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

Marks.propTypes = {
  user: PropTypes.object.isRequired,
};


export default Marks;