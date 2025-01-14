import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaMoon, FaLightbulb } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/Theme/themeSlice";
import { signOutSuccess } from "../redux/user/userSlice";
import Button from "../components/ui/Button";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignout = async () => {
    try {
      const res = await fetch("api/auth/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
        navigate("/sign-in");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur dark:bg-gray-900/90 dark:text-white border-gray-300 dark:border-b-1 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          {/* Brand/Logo */}
          <div className="flex items-center gap-2">
            <Link to="/" className="text-primary dark:text-fave text-2xl font-bold">
              TET TTS App
            </Link>
            <img src="../public/logo.png" alt="Logo" width={50} height={20} />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 flex-grow justify-center">
            <div className="flex items-center gap-4">
              <Link
                  to="/"
                  className="py-2 px-4 text-gray-700 dark:text-white hover:text-fave dark:hover:text-primary"
              >
                Home
              </Link>
              <Link
                  to="/dashboard?tab=file-to-speech"
                  className="py-2 px-4 text-gray-700 dark:text-white hover:text-fave dark:hover:text-primary"
              >
                FileToSpeech
              </Link>
              <Link
                  to="/dashboard?tab=history"
                  className="py-2 px-4 text-gray-700 dark:text-white hover:text-fave dark:hover:text-primary"
              >
                History
              </Link>
            </div>
          </div>

          {/* Desktop Authentication */}
          <div className="hidden md:flex items-center gap-4">
            {/* Dark mode Toggle Button */}
            <button
                className="w-10 h-10  rounded-full p-2 flex items-center justify-center  text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => dispatch(toggleTheme())}
            >
              {theme === "light" ? <FaMoon /> : <FaLightbulb />}
            </button>
           <Button variant='primary' className=" text-white rounded-full dark:text-white dark:bg-fave dark:hover:bg-[#6c20f3]  hover:bg-[#08a8db] ">
             <Link
                 to="/dashboard?tab=dash"

             >
               Dashboard
             </Link>
           </Button>
            {currentUser ? (
                <div className="relative">
                  <button
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      className="flex items-center focus:outline-none"
                  >
                    <img
                        alt="user"
                        src={currentUser.profilePicture}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                  </button>

                  {isMobileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                        <div className="px-4 py-2">
                                 <span className="block text-sm font-bold text-gray-800 dark:text-white">
                                         @{currentUser.username || currentUser.firstName}
                                   </span>
                          <span className="block text-sm  text-gray-600 dark:text-gray-400 truncate">
                                           @{currentUser.email}
                                     </span>
                        </div>
                        <Link to={"/dashboard?tab=profile"}>
                          <div className="block py-2 px-4 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 ">
                            Profile
                          </div>
                        </Link>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                        <button
                            onClick={handleSignout}
                            className="block py-2 px-4 w-full text-left text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          SignOut
                        </button>
                      </div>
                  )}
                </div>
            ) : (

               <Button variant="primary" className=" text-white rounded-md  dark:text-white dark:bg-fave dark:hover:bg-[#6c20f3]  hover:bg-[#08a8db] ">
                 <Link
                     to="/sign-in"
                     className=""
                 >
                   Login
                 </Link>
               </Button>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center">
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className=" focus:outline-none focus:bg-gray-100  dark:focus:bg-gray-700 rounded-md p-1"
            >
              <svg
                  className="w-6 h-6 text-gray-700 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
              >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
            {/* Dark mode Toggle Button */}
            <button
                className="w-10 h-10  rounded-full p-2 flex items-center justify-center  text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 ml-2"
                onClick={() => dispatch(toggleTheme())}
            >
              {theme === "light" ? <FaMoon /> : <FaLightbulb />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
            <div className="md:hidden bg-white dark:bg-gray-900 pb-4">
              <div className=" flex flex-col">
                <Link
                    to="/"
                    className="block py-2 px-4 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 "
                >
                  Home
                </Link>
                <Link
                    to="/dashboard?tab=file-to-speech"
                    className="block py-2 px-4 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  FileToSpeech
                </Link>
                <Link
                    to="/dashboard?tab=history"
                    className="block py-2 px-4 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  HisTory
                </Link>
              </div>
            </div>
        )}
      </nav>
  );
}