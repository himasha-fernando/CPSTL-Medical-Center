import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Pages/Login";
import AddNewPatient from "./Pages/AddNewPatient";
import ProfilePage from "./Pages/ProfilePage";
import Dashboard from "./Pages/Dashboard";
import ManagePatients from "./Pages/ManagePatients";
import ManageStaff from "./Pages/ManageStaff";
import AddStaff from "./Pages/AddStaff";
import RegisterPatient from "./Pages/RegisterPatient";
import PatientCount from "./Pages/PatientCount";
import UserDashboard from "./Pages/UserDashboard";
import StaffProfilePage from "./Pages/StaffProfilePage";
import MyReports from "./Pages/MyReports";
import Schedule from "./Pages/Schedule";
import FunctionReports from "./Pages/FunctionReports";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          
          <Route path="/" element={<Login />} />
          <Route path="/AddNewPatient" element={<AddNewPatient />} />
          <Route path="/ProfilePage" element={<ProfilePage />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/ManagePatients" element={<ManagePatients />} />
          <Route path="/ManageStaff" element={<ManageStaff />} />
          <Route path="/AddStaff" element={<AddStaff />} />
          <Route path="/RegisterPatient" element={<RegisterPatient />} />
          <Route path="/PatientCount" element={<PatientCount />} />
          <Route path="/UserDashboard" element={<UserDashboard/>}/>
          <Route path="/StaffProfilePage" element={<StaffProfilePage/>}/>
          <Route path="/MyReports" element={<MyReports/>}/>
          <Route path="/Schedule" element={<Schedule/>}/>
          <Route path="/FunctionReports" element={<FunctionReports/>}/>
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
