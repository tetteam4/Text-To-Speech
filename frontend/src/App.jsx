// client/src/App.jsx
import React, { useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  // useNavigate,
} from "react-router-dom";
import Home from "./pages/Home";
// import TextToSpeech from "./pages/TextToSpeech";
// import FileToSpeech from "./pages/FileToSpeech";
// import History from "./pages/History";
// import Profile from "./pages/Profile";
import MainLayout from "./components/layout/MainLayout";
import Layout from "./components/layout/Layout";
import "./styles/index.css";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import useStore from "./store/store";
import PrivateRoute from "./components/route/PrivateRoute";
import AdminRoute from "./components/route/AdminRoute";
import ProjectDashboard from "./pages/ProjectDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";

function App() {
  const { isAuthenticated, user, fetchVoices, hydrateStore } = useStore();
  // const navigate = useNavigate();
  const isMounted = useRef(false);

 
    useEffect(() => {
      hydrateStore();
    }, [hydrateStore]);



     useEffect(() => {
       if (isMounted.current) {
         if (isAuthenticated && user && !user.role) {
          //  navigate("/");
         }
       } else {
         isMounted.current = true;
       }
     }, [isAuthenticated, user]);
  
    // useEffect(() => {
    //   fetchVoices();
    // }, [fetchVoices]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/"       element={ <MainLayout>  <Home /> </MainLayout> }/>
        <Route element={<PrivateRoute />}>
          <Route
            path="/dashboard"
            element={
              <Layout>
                <UserDashboard />
              </Layout>
            }
          />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin-dash" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
