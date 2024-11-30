import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

function OTP({ email, otp }) {
  const [timerCount, setTimer] = useState(60);
  const [OTPinput, setOTPinput] = useState(["", "", "", ""]);
  const [disable, setDisable] = useState(true);
  const navigate = useNavigate();
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const resendOTP = () => {
    if (disable) 
      return;
      axios.post("http://localhost:3001/send_recovery_email", { OTP: otp, recipient_email: email })
        .then(() => {
          setDisable(true);
          console.log("sent");
      })
      .then(() => alert("A new OTP has successfully been sent to your email."))
      .then(() => setTimer(60))
      .catch(console.log);
    };

  const verifyOTP = (e) => {
    e.preventDefault();
    const enteredOTP = OTPinput.join("");
    if (enteredOTP === otp.toString()) 
    {
      navigate("/reset");
    } else 
    {
      alert("The code you have entered is not correct, try again or re-send the link");
    }
  };

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        if (lastTimerCount <= 1) 
        {
          clearInterval(interval);
          setDisable(false);
        }
        return lastTimerCount - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [disable]);

  const handleInputChange = (index, value, e) => {
    if (isNaN(value) && e.key !== 'Backspace') return;
    const newOTPinput = [...OTPinput];
    newOTPinput[index] = value;
    setOTPinput(newOTPinput);

    if (value !== "" && index < inputRefs.length - 1) {
      inputRefs[index + 1].current.focus();
    } else if (value === "" && index > 0 && e.key === 'Backspace') {
      inputRefs[index - 1].current.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 to-green-400 flex flex-col items-center justify-center p-4 w-full">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-green-200/80 mt-12 backdrop-blur-lg rounded-2xl shadow-lg md:p-12">
        <h2 className="text-center text-3xl font-semibold text-gray-700">Email Verification</h2>
        <p className="text-center text-gray-600 mt-2">We have sent a code to your email</p>
        <form className="mt-8 space-y-6" onSubmit={verifyOTP}>
          <div className="flex justify-center mb-8">
            {OTPinput.map((_, index) => (
              <input
                key={index}
                type="text"
                className="focus:outline-none text-xl px-4 py-2 mx-2 border border-gray-300 rounded-lg text-center"
                maxLength="1"
                required
                ref={inputRefs[index]}
                value={OTPinput[index]}
                onChange={(e) => handleInputChange(index, e.target.value, e)}
                onKeyDown={(e) => handleInputChange(index, e.target.value, e)}
                style={{ width: "45px" }}
              />
            ))}
          </div>
          <input
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            type="submit"
            value="Verify Account"
          />
          <div className="flex mt-4 text-sm justify-center">
            <p className="text-gray-700">Didn't receive code?&nbsp;</p>
            <p
              className="cursor-pointer"
              style={{
                color: disable ? "gray" : "#147460",
                textDecoration: disable ? "none" : "underline",
              }}
              onClick={resendOTP}
            >
              {disable ? `Resend OTP in ${timerCount}s` : "Resend OTP"}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

OTP.propTypes = {
  email: PropTypes.string.isRequired,
  otp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

export default OTP;
