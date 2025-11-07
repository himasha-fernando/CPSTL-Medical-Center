// src/App.js
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

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Only the public login route is included */}
          <Route path="/" element={<Login />} />
          <Route path="/AddNewPatient" element={<AddNewPatient />} />
          <Route path="/ProfilePage" element={<ProfilePage />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/ManagePatients" element={<ManagePatients />} />
          <Route path="/ManageStaff" element={<ManageStaff />} />
          <Route path="/AddStaff" element={<AddStaff />} />
          <Route path="/RegisterPatient" element={<RegisterPatient />} />
          <Route path="/PatientCount" element={<PatientCount />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
