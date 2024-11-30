import { Link } from "react-router-dom";

const Error404 = () => {

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 to-green-400 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <Link
          to='/home'
          className="bg-green-200/80 flex-col backdrop-blur-lg rounded-2xl font-semibold shadow-lg p-4"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default Error404;
