import { Link } from "react-router-dom";
import { AiOutlineCheckCircle, AiOutlineEdit, AiOutlineFileExclamation } from "react-icons/ai";
const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 to-green-400 flex flex-col items-center justify-center p-4">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-green-900 text-center mt-10 mb-10">
          Welcome to CECT Portal
        </h1>
        <div className="flex flex-wrap justify-center">
          <div className="w-full md:w-1/2 lg:w-1/3 p-4">
            <div className="bg-green-200/80 flex items-center flex-col backdrop-blur-lg rounded-2xl shadow-lg p-6 md:p-12">
              <AiOutlineCheckCircle className="w-16 h-16 mb-4 text-green-500" />
              <h1 className="text-3xl font-semibold mb-4 text-gray-700">Registration form</h1>
              <p className="mb-6 text-gray-600">
                Get approval from your college management for your newly registered NPTEL course for credit transfer.
              </p>
              <Link to="../approval">
                <button className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md font-medium">
                  Request Approval
                </button>
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3 p-4">
            <div className="bg-green-200/80 flex items-center flex-col backdrop-blur-lg rounded-2xl shadow-lg p-6 md:p-12">
              <AiOutlineEdit className="w-16 h-16 mb-4 text-green-500" />
              <h1 className="text-3xl font-semibold mb-4 text-gray-700">Mark Updation Form</h1>
              <p className="mb-6 text-gray-600">
                Update your marks after the results are officially published officially from the NPTEL organization.
              </p>
              <Link to="../update">
                <button className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md font-medium">
                  Update Marks
                </button>
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3 p-4">
            <div className="bg-green-200/80 flex items-center flex-col backdrop-blur-lg rounded-2xl shadow-lg p-6 md:p-12">
              <AiOutlineFileExclamation className="w-16 h-16 mb-4 text-green-500" />
              <h1 className="text-3xl font-semibold mb-4 text-gray-700">Drop Form</h1>
              <p className="mb-6 text-gray-600">
                Submit the details of the course you are dropping after verification and management approval.
              </p>
              <Link to="../drop">
                <button className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md font-medium">
                  Apply Course
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
