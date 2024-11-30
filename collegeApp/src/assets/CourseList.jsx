import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaFileImport } from "react-icons/fa";
import Swal from "sweetalert2";

const CourseManagementPage = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    code: "",
    name: "",
    credit: "",
    week: "",
  });
  const fileInputRef = useRef(null);
  function showAlert(message, type = "success") {
    Swal.fire({
      title: type === "success" ? "Success!" : "Error!",
      text: message,
      icon: type,
      confirmButtonText: "OK",
    });
  }

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/courses");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses", error);
      }
    };

    fetchCourses();
  }, []);

  const handleSave = async () => {
    try 
    {
      const response = await axios.post("http://localhost:3001/api/courses", newCourse);
      setCourses([...courses, response.data]);
      setNewCourse({ code: "", name: "", credit: "", week: "" });
      showAlert("Course added successfully!");
    } 
    catch (error) 
    {
      console.error("Error adding course", error);
      showAlert("Failed to add course.", "error");
    }
  };

  const handleDeleteCourse = async (id) => {
    try 
    {
      await axios.delete(`http://localhost:3001/api/courses/${id}`);
      setCourses(courses.filter((course) => course._id !== id));
      showAlert("Course deleted successfully!");
    } 
    catch (error) 
    {
      console.error("Error deleting course", error);
      showAlert("Failed to delete course.", "error");
    }
  };

  const handleChangeNewCourse = (e) => {
    const { name, value } = e.target;
    setNewCourse((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    try 
    {
      await axios.post("http://localhost:3001/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      showAlert("Courses imported successfully!");
      const reader = new FileReader();
      reader.onload = (event) => {
        localStorage.setItem("importedFile", event.target.result);
      };
      reader.readAsDataURL(file);
      const fetchCourses = async () => {
        try {
          const response = await axios.get("http://localhost:3001/api/courses");
          setCourses(response.data);
        } catch (error) {
          console.error("Error fetching courses", error);
        }
      };
      fetchCourses();
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } 
    catch (error) 
    {
      console.error("There was an error uploading the file!", error);
      showAlert("Failed to import courses.", "error");
    }
  };

  const handleDeleteAllCourses = async () => {
    try 
    {
      await axios.delete("http://localhost:3001/api/courses");
      setCourses([]);
      localStorage.removeItem("importedFile");
      showAlert("All courses deleted successfully!");
    } 
    catch (error) 
    {
      console.error("Error deleting all courses", error);
      showAlert("Failed to delete all courses.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 to-green-400 flex mt-10 flex-col items-center justify-center p-4">
      <div className="max-w-7xl mx-auto w-full">
        <div className="bg-green-200/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 md:p-12 w-full">
          <h1 className="text-3xl md:text-5xl mt-10 font-bold text-green-900 text-center mb-4">
            Course Management
          </h1>

          <div className="flex flex-col md:flex-row justify-between mb-8 space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                className="hidden"
                id="fileUpload"
                ref={fileInputRef}
              />
              <label
                htmlFor="fileUpload"
                className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full shadow-md transition-all duration-300 transform hover:-translate-y-1 w-full md:w-auto justify-center cursor-pointer"
              >
                <FaFileImport className="mr-2" />
                IMPORT COURSES
              </label>
              <button
                onClick={handleDeleteAllCourses}
                className="flex items-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-full shadow-md transition-all duration-300 transform hover:-translate-y-1 w-full md:w-auto justify-center"
              >
                <FaTrash className="mr-2" />
                DELETE ALL COURSES
              </button>
            </div>
          </div>

          <div className="overflow-x-auto shadow-lg rounded-lg w-full">
            <table className="w-full border-collapse bg-green-100/70 backdrop-blur-lg rounded-lg">
              <thead>
                <tr className="bg-green-600 text-white text-left">
                  <th className="py-4 px-3 sm:px-6 text-xs sm:text-sm md:text-base font-semibold">Course Code</th>
                  <th className="py-4 px-3 sm:px-6 text-xs sm:text-sm md:text-base font-semibold">Course Name</th>
                  <th className="py-4 px-3 sm:px-6 text-xs sm:text-sm md:text-base font-semibold">Credit</th>
                  <th className="py-4 px-3 sm:px-6 text-xs sm:text-sm md:text-base font-semibold">Duration in Weeks</th>
                  <th className="py-4 px-3 sm:px-6 text-xs sm:text-sm md:text-base font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course._id} className="hover:bg-green-100 transition-all duration-200">
                    <td className="py-4 px-3 sm:px-6 text-xs sm:text-sm md:text-base">{course.code}</td>
                    <td className="py-4 px-3 sm:px-6 text-xs sm:text-sm md:text-base">{course.name}</td>
                    <td className="py-4 px-3 sm:px-6 text-xs sm:text-sm md:text-base">{course.credit}</td>
                    <td className="py-4 px-3 sm:px-6 text-xs sm:text-sm md:text-base">{course.week}</td>
                    <td className="py-4 px-3 sm:px-6 text-center">
                      <button
                        onClick={() => handleDeleteCourse(course._id)}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-300 transform hover:-translate-y-1 text-xs md:text-sm"
                      >
                        <FaTrash className="inline-block mr-2" />
                        DELETE
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="py-4 px-3 sm:px-6 text-xs sm:text-sm md:text-base">
                    <input
                      type="text"
                      name="code"
                      value={newCourse.code}
                      onChange={handleChangeNewCourse}
                      placeholder="Enter Course Code"
                      className="w-full px-3 py-2 border border-green-300 rounded-lg"
                    />
                  </td>
                  <td className="py-4 px-3 sm:px-6 text-xs sm:text-sm md:text-base">
                    <input
                      type="text"
                      name="name"
                      value={newCourse.name}
                      onChange={handleChangeNewCourse}
                      placeholder="Enter Course Name"
                      className="w-full px-3 py-2 border border-green-300 rounded-lg"
                    />
                  </td>
                  <td className="py-4 px-3 sm:px-6 text-xs sm:text-sm md:text-base">
                    <input
                      type="text"
                      name="credit"
                      value={newCourse.credit}
                      onChange={handleChangeNewCourse}
                      placeholder="Enter Credit"
                      className="w-full px-3 py-2 border border-green-300 rounded-lg"
                    />
                  </td>
                  <td className="py-4 px-3 sm:px-6 text-xs sm:text-sm md:text-base">
                    <input
                      type="text"
                      name="week"
                      value={newCourse.week}
                      onChange={handleChangeNewCourse}
                      placeholder="Enter Duration"
                      className="w-full px-3 py-2 border border-green-300 rounded-lg"
                    />
                  </td>
                  <td className="py-4 px-3 sm:px-6 text-center">
                    <button
                      onClick={handleSave}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-300 transform hover:-translate-y-1 text-xs md:text-sm"
                    >
                      <FaPlus className="inline-block mr-2" />
                      SAVE COURSE
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseManagementPage;
