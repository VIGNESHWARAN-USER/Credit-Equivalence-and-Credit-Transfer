import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { IoReorderThreeOutline, IoArrowBack } from "react-icons/io5";
import { AiOutlineHome, AiOutlineLogin, AiOutlineLogout, AiOutlineForm } from "react-icons/ai";
import PropTypes from "prop-types";
import logo from "../images/logo.jpeg";

const Head = ({ role }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [svg, setSvg] = useState(0);
  const [storedRole, setStoredRole] = useState(role);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setStoredRole(user.role);
    }
  }, [ role]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
        setSvg(0);
      }
    };

    if (dropdownVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownVisible]);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
    setSvg((prevSvg) => (prevSvg ? 0 : 1));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setStoredName("");
    navigate("/login");
  };

  const handleBackNavigation = () => {
    navigate(-1);
  };

  return (
    <header className="bg-gradient-to-r from-green-700 via-green-500 to-green-400 text-white flex justify-between items-center h-16 px-4 md:px-6 shadow-lg fixed top-0 w-full z-50">
    <div className="flex items-center space-x-2 md:space-x-4">
      <button onClick={handleBackNavigation} className="text-2xl md:text-3xl hover:text-green-200">
        <IoArrowBack />
      </button>
      <img src={logo} alt="Logo" className="h-10 w-10 md:h-14 md:w-14 rounded-full shadow-lg border-2 border-white" />
      <span className="text-3xl md:text-3xl font-bold">Knowledge Institute of Technology</span>
    </div>
    <div className="flex flex-col text-center">
      <div className="text-lg md:text-2xl font-bold tracking-wide ml-96">
        CECT PORTAL
      </div>
      <div className="text-xs md:text-sm italic ml-96">
        Credit Equivalence and Credit Transfer
      </div>
    </div>
    <div ref={dropdownRef} className="relative">
      <button
        onClick={toggleDropdown}
        className="text-3xl md:text-4xl focus:outline-none transform hover:scale-110 transition-transform duration-200"
      >
        {svg === 0 ? <IoReorderThreeOutline /> : <RxCross2 />}
      </button>

      {dropdownVisible && (
        <div className="absolute right-0 mt-4 w-40 md:w-48 bg-white text-black shadow-lg rounded-lg animate-fade-in-down">
          {storedRole === "hod" ? (
            <>
              <Link to="/home" className="flex items-center px-4 py-2 hover:bg-green-500 hover:text-white transition-colors duration-200">
                <AiOutlineHome className="mr-2" /> Home
              </Link>
              <Link to="../login" className="flex items-center px-4 py-2 hover:bg-green-500 hover:text-white transition-colors duration-200">
                <AiOutlineLogin className="mr-2" /> Login
              </Link>
              <Link to="../login" onClick={handleLogout} className="flex items-center px-4 py-2 hover:bg-green-500 hover:text-white transition-colors duration-200">
                <AiOutlineLogout className="mr-2" /> Logout
              </Link>
            </>
          ) : storedRole === "student" ? (
            <>
              <Link to="/home" className="flex items-center px-4 py-2 hover:bg-green-500 hover:text-white transition-colors duration-200">
                <AiOutlineHome className="mr-2" /> Home
              </Link>
              <Link to="/forms" className="flex items-center px-4 py-2 hover:bg-green-500 hover:text-white transition-colors duration-200">
                <AiOutlineForm className="mr-2" /> My Forms
              </Link>
              <Link to="../login" className="flex items-center px-4 py-2 hover:bg-green-500 hover:text-white transition-colors duration-200">
                <AiOutlineLogin className="mr-2" /> Login
              </Link>
              <Link to="../login" onClick={handleLogout} className="flex items-center px-4 py-2 hover:bg-green-500 hover:text-white transition-colors duration-200">
                <AiOutlineLogout className="mr-2" /> Logout
              </Link>
            </>
          ) : (
            <>
              <Link to="/home" className="flex items-center px-4 py-2 hover:bg-green-500 hover:text-white transition-colors duration-200">
                <AiOutlineHome className="mr-2" /> Home
              </Link>
              <Link to="../login" className="flex items-center px-4 py-2 hover:bg-green-500 hover:text-white transition-colors duration-200">
                <AiOutlineLogin className="mr-2" /> Login
              </Link>
              <Link to="../login" onClick={handleLogout} className="flex items-center px-4 py-2 hover:bg-green-500 hover:text-white transition-colors duration-200">
                <AiOutlineLogout className="mr-2" /> Logout
              </Link>
            </>
          )}
        </div>
      )}
  </div>
</header>

  );
};

Head.propTypes = {
  role: PropTypes.string.isRequired,
};

export default Head;
