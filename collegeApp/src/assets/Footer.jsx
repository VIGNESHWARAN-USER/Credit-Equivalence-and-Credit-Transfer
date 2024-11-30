import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-green-700 via-green-500 to-green-400 text-white py-4 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        <div className="mb-4 md:mb-0">
          <h4 className="font-bold text-lg">Knowledge Institute of Technology</h4>
          <p>© 2024 CECT Portal. All Rights Reserved.</p>
        </div>
        <div className="flex space-x-4">
          <a href="/" className="hover:text-green-200">Home</a>
          <a href="/help" className="hover:text-green-200">Help</a>
          <a href="/contact" className="hover:text-green-200">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
