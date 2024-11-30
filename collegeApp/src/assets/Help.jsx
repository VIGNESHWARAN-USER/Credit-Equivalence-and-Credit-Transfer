import React from 'react';
import img1 from "../images/img1.png";
import img2 from "../images/img2.png";
import img3 from "../images/img3.png";
import img4 from "../images/img4.png";
import img5 from "../images/img5.png";

const Help = () => {
  return (
    <div className="mx-auto p-4 md:p-8  bg-gradient-to-b from-green-200 to-green-400 ">
      <div className="flex flex-col items-center">
        <a 
          target='_blank'
          href="https://archive.nptel.ac.in/noc/" 
          className="text-blue-500 underline text-lg mb-8 mt-16">
          Click this link to visit the site
        </a>
        
        <div className="mb-12">
          <p className="font-bold text-xl mb-4">Click Candidate Login and login with your mail id</p>
          <img src={img1} alt="Image 1" className="w-full rounded-lg shadow-lg mb-6"/>
        </div>
        
        <div className="mb-12">
          <p className="font-bold text-xl mb-4">Click Candidate</p>
          <img src={img2} alt="Image 2" className="w-full rounded-lg shadow-lg mb-6" />
        </div>
        
        <div className="mb-12">
          <p className="font-bold text-xl mb-4">Click "Click Here"</p>  
          <img src={img3} alt="Image 3" className="w-full rounded-lg shadow-lg mb-6" />
        </div>
        
        <div className="mb-12">
          <p className="font-bold text-xl mb-4">Right-click on "Download E-Certificate"</p>
          <img src={img4} alt="Image 4" className="w-full rounded-lg shadow-lg mb-6" />
        </div>
       
        <div className="mb-12">
          <p className="font-bold text-xl mb-4">Copy Link Address</p>
          <img src={img5} alt="Image 5" className="w-full rounded-lg shadow-lg mb-6" />
        </div>
      </div>
    </div>
  );
};

export default Help;
