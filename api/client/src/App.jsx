import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
// import About from "./pages/About";
// import Gallery from "./pages/Gallery";
import Signin from "./pages/Signin";
import Signup from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdmin";

import UserProfile from "./pages/Profile";
import ScrollTop from "./components/ScrollTop";
import NotFoundPage from "./pages/NotFoundPage";
// import Search from "./pages/Search";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <ScrollTop />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<Signin />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route element={<OnlyAdminPrivateRoute />}>
            {/* <Route path="/create-post" element={<CreatePost />} /> */}
            {/* <Route path="/update-post/:postId" element={<UpdatePost />} /> */}
          </Route>
          <Route path="*" element={<NotFoundPage />} />
          {/* <Route path="/post/:postSlug" element={<PostPage />} /> */}
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}
