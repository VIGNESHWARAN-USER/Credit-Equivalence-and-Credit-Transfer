import { Link, useLocation, useParams } from 'react-router-dom';

const Section = () => {
  const { dept } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const year = queryParams.get('year');

  const sections = ['A', 'B', 'C'];

  return (
    <div className="flex flex-wrap justify-center items-center">
      {sections.map(section => (
        <div key={section} className="w-3/4 p-4 mt-20">
          <Link to={{ pathname: `/nextPage`, search: `?year=${year}&dept=${dept}&section=${section}` }}>
            <div className="shadow-black text-red-800 font-medium hover:bg-red-800 hover:text-white hover:border-none p-6 rounded shadow flex justify-center items-center mb-10">
              <h2 className="text-lg font-bold">Section - {section}</h2>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Section;
