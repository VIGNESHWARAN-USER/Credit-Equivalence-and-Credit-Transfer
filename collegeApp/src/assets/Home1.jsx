import { Link } from "react-router-dom";
import { AiOutlineCheckCircle, AiOutlineEdit, AiOutlineFileExclamation } from "react-icons/ai";
const Home1 = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 to-green-400 flex flex-col items-center justify-center p-4">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-gray-800 text-center  mt-10 mb-10">
          Request Forms
        </h1>
        <div className="flex flex-wrap justify-center">
          <div className="w-full md:w-1/2 lg:w-1/3 p-4">
            <div className="bg-green-200/80 flex items-center flex-col backdrop-blur-lg rounded-2xl shadow-lg p-6 md:p-12">
              <AiOutlineCheckCircle className="w-16 h-16 mb-4 text-green-500" />
              <h1 className="text-3xl font-semibold mb-4 text-gray-700">Course Approval</h1>
              <p className="mb-6 text-gray-600">Submit your request for course approval here.</p>
              <Link to="../approval">
                <button className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md font-medium">
                  Approval Forms
                </button>
              </Link>
            </div>
          </div>

          <div className="w-full md:w-1/2 lg:w-1/3 p-4">
            <div className="bg-green-200/80 flex items-center flex-col backdrop-blur-lg rounded-2xl shadow-lg p-6 md:p-12">
              <AiOutlineEdit className="w-16 h-16 mb-4 text-green-500" />
              <h1 className="text-3xl font-semibold mb-4 text-green-900">Mark Verification</h1>
              <p className="mb-6 text-green-900">Update your marks with this request form.</p>
              <Link to="../markupdation">
                <button className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md font-medium">
                  Verify Mark Forms
                </button>
              </Link>
            </div>
          </div>

          <div className="w-full md:w-1/2 lg:w-1/3 p-4">
            <div className="bg-green-200/80 flex items-center flex-col backdrop-blur-lg rounded-2xl shadow-lg p-6 md:p-12">
              <AiOutlineFileExclamation className="w-16 h-16 mb-4 text-green-500" />
              <h1 className="text-3xl font-semibold mb-4 text-gray-700">Drop Form</h1>
              <p className="mb-6 text-gray-600">Request to drop a course using this form.</p>
              <Link to="../drop">
                <button className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md font-medium">
                  Verify Drop Forms
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home1;
