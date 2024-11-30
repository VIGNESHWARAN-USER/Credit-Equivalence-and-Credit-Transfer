import { Link, useLocation } from 'react-router-dom';

const Department = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const year = queryParams.get('year');

  const departments = ["CSE", "IT", "AIDS", "CSBS", "MECH", "CIVIL", "ECE", "EEE"];

  return (
    <div>
      <div className="flex flex-wrap justify-center items-center mt-6">
        {departments.map(dept => (
          <div key={dept} className="w-full sm:w-1/2 lg:w-1/4 p-4 ml-20 mr-20">
            <Link to={{ pathname: `/Dept/${dept}`, search: `?year=${year}` }}>
              <div className="shadow-black text-red-800 font-medium hover:bg-red-800 hover:text-white hover:border-none p-6 rounded shadow flex justify-center items-center mb-10">
                <h2 className="text-lg font-bold">{dept}</h2>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Department;
