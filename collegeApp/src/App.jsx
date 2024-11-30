import { Route, Routes, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import Login from "./assets/Login";
import Head from "./assets/Head";
import Footer from "./assets/Footer"; 
import Password from "./assets/Password";
import Home from "./assets/Home";
import Marks from "./assets/Marks";
import Drop from "./assets/Drop";
import OTP from "./assets/OTP";
import Approval from "./assets/Approval";
import Updation from "./assets/Updation";
import Forms from "./assets/Forms";
import Home1 from "./assets/Home1";
import Home2 from "./assets/Home2";
import ReqApprl from "./assets/ReqApprl";
import ReqApprlhod from "./assets/ReqApprlhod";
import ReqApprldir from "./assets/ReqApprldir";
import Home3 from "./assets/Home3";
import Preview from "./assets/Preview"
import Department from "./assets/Department";
import Section from "./assets/Section";
import CourseManagementPage from "./assets/CourseList";
import ReqDrophod from "./assets/ReqDrophod";
import ReqDropdir from "./assets/ReqDropdir";
import ReqDrop from "./assets/ReqDrop";
import PreviewDrop from "./assets/PreviewDrop";
import MarkPreview from "./assets/MarkPreview";
import ReqUpdation from "./assets/ReqUpdation";
import Help from "./assets/Help";
import ApprovedStud from "./assets/ApprovedStud"
import Error404 from "./assets/Error404";
import RejectedStud from "./assets/RejectedStud";
import ApprovedStudDrop from "./assets/ApprovedStudDrop";
import RejectedStudDrop from "./assets/RejectedStudDrop";
import Upload from "./assets/upload";

function App() {
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [name, setname] = useState("");
  const [user, setuser] = useState(null);
  const [mail, setmail] = useState("");
  const [year, setyear] = useState("");
  const [sec, setsec] = useState("");
  const [dept, setdept] = useState("");
  const [role, setrole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setname(`${storedUser.first} ${storedUser.last}`);
      setmail(storedUser.Email);
      setyear(storedUser.year);
      setsec(storedUser.sec);
      setdept(storedUser.dept);
      setuser(storedUser);
      setrole(storedUser.role);
    } else {
      // If no user data found, redirect to login
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <Head name={name} role={role}/>
      <Routes>
      <Route path="/" element={<Login email={email} setEmail={setEmail} setOTP={setOTP} otp={otp} setname={setname} setuser={setuser} setrole={setrole}/>} />
        <Route path="/login" element={<Login email={email} setEmail={setEmail} setOTP={setOTP} otp={otp} setname={setname} setuser={setuser} setrole={setrole}/>} />
        <Route path="/reset" element={<Password email={email} />} />
        <Route path="/otp" element={<OTP email={email} otp={otp} />} />
        <Route path="/home" element={
          role === "student" ? <Home /> :
          role === "ca" ? <Home1 year={year} sec={sec} dept={dept}/> :
          role === "hod" ? <Home2 /> :
          role === 'dir' ? <Home3/>:
          role === 'OA'? <Upload user={user}/>:
          <CourseManagementPage/>
        } />
        <Route path="/approval" element={
          role === "student" ? <Approval user={user} /> :
          role === "ca" ? <ReqApprl year={year} sec={sec} dept={dept}/> :
          role === "hod" ? <ReqApprlhod dept={dept}/> :
          <ReqApprldir/>
        } />
        <Route path="/drop" element={
          role === "student" ? <Drop user={user} /> :
          role === "ca" ? <ReqDrop year={year} sec={sec} dept={dept}/> :
          role === "hod" ? <ReqDrophod dept={dept}/> :
          <ReqDropdir/>
        } />
        <Route path="/marks" element={<Marks user = {user}/>} />
        <Route path="/forms" element={<Forms mail={mail}/>} />
        <Route path="/update" element={<Updation user={user}/>} />
        <Route path="/preview" element={<Preview user={user}/>} />
        <Route path ="/droppreview" element={<PreviewDrop/>}/>
        <Route path="/dept" element={<Department/>} />
        <Route path="/section" element={<Section/>} />
        <Route path="/course-list" element={<CourseManagementPage/>} />
        <Route path="/markpreview" element={<MarkPreview/>}/>
        <Route path="/markupdation" element={<ReqUpdation user = {user}/>}/>
        <Route path="/Help" element={<Help/>}/>
        <Route path="/ApprovedStud" element={<ApprovedStud/>}/>
        <Route path="/ApprovedStuddrop" element={<ApprovedStudDrop/>}/>
        <Route path="/RejectedStud" element={<RejectedStud/>}/>
        <Route path="/RejectedStuddrop" element={<RejectedStudDrop/>}/>
        <Route path="/upload" element={<Upload/>}/>

        <Route path="*" element={<Error404/>}/>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
