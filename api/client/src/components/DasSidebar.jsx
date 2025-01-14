// client/src/components/DasSidebar.jsx
import { useState, useRef, useEffect } from "react";
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from "react-icons/hi";
import { BsPostcardFill } from "react-icons/bs";
import { useLocation, Link } from "react-router-dom";
import { signOutSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function DashSidebar({toggleSidebar, isSidebarOpen}) {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const sidebarRef = useRef(null);
  const [closeOnClick, setCloseOnClick] = useState(false);


  useEffect(() => {
    const urlPrams = new URLSearchParams(location.search);
    const tabFromUrl = urlPrams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isSidebarOpen) {
        toggleSidebar();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen, toggleSidebar]);

  const handleSignout = async () => {
    try {
      const res = await fetch("api/user/signout", {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleNavigate = (to) => {
    if(closeOnClick) {
      toggleSidebar()
    }
    navigate(to)
  };

  return (
      <aside
          ref={sidebarRef}
          className={`fixed top-16 left-0 h-screen transition-all duration-300 pt-8 dark:text-white
              ${isSidebarOpen ? "md:w-56 lg:w-56" : "md:w-16 lg:w-16"}
               ${isSidebarOpen ? "z-40" : "z-0"}
               bg-white/90 backdrop-blur dark:bg-gray-900/90
               ${isSidebarOpen ? "md:relative" : "absolute top-0"}
              `}
      >
        <div className="p-4 flex items-center justify-between">
          <button onClick={toggleSidebar} className="focus:outline-none">
            <svg
                className={`h-6 w-6 text-gray-700 dark:text-gray-300
                            ${isSidebarOpen ? "rotate-180" : ""}
                         `}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
              <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-2 p-2">
          {/* Profile Item */}
          <Link to="/dashboard?tab=profile" onClick={() => setCloseOnClick(true)}  className="relative">
            <div
                className={`
                          flex items-center  rounded-md p-2
                           hover:bg-gray-200 dark:hover:bg-gray-700
                             ${tab === "profile" ? "bg-gray-200 dark:bg-gray-700" : " "}
                            `}
            >
                         <span className="flex items-center gap-2 ">
                              <HiUser className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                           {isSidebarOpen && (
                               <span className="text-gray-700 dark:text-gray-300">
                                  {currentUser.isAdmin ? "Admin" : "User"} Profile
                               </span>
                           )}
                         </span>
            </div>
          </Link>
          {/*Dashboard Item */}
          <Link to="/dashboard?tab=dash" onClick={() => setCloseOnClick(true)} className="relative">
            <div
                className={`
                            flex items-center  rounded-md p-2
                             hover:bg-gray-200 dark:hover:bg-gray-700
                                ${tab === "dash" ? "bg-gray-200 dark:bg-gray-700" : " "}
                           `}
            >
                          <span className="flex items-center gap-2 ">
                               <HiChartPie className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                            {isSidebarOpen && (
                                <span className="text-gray-700 dark:text-gray-300">
                                 Dashboard
                                </span>
                            )}
                         </span>
            </div>
          </Link>

          <Link to="/dashboard?tab=text-to-speech" onClick={() => setCloseOnClick(true)}  className="relative">
            <div
                className={`
                              flex items-center  rounded-md p-2
                             hover:bg-gray-200 dark:hover:bg-gray-700
                               ${
                    tab === "text-to-speech"
                        ? "bg-gray-200 dark:bg-gray-700"
                        : " "
                }
                            `}
            >
                             <span className="flex items-center gap-2 ">
                                <BsPostcardFill className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                               {isSidebarOpen && (
                                   <span className="text-gray-700 dark:text-gray-300">
                                   TextToSpeech
                                 </span>
                               )}
                           </span>
            </div>
          </Link>
          {/*FileToSpeech Item */}
          <Link to="/dashboard?tab=file-to-speech" onClick={() => setCloseOnClick(true)}  className="relative">
            <div
                className={`
                                flex items-center  rounded-md p-2
                               hover:bg-gray-200 dark:hover:bg-gray-700
                                 ${
                    tab === "file-to-speech"
                        ? "bg-gray-200 dark:bg-gray-700"
                        : " "
                }
                             `}
            >
                           <span className="flex items-center gap-2 ">
                              <HiDocumentText className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                             {isSidebarOpen && (
                                 <span className="text-gray-700 dark:text-gray-300">
                                     FileToSpeech
                                  </span>
                             )}
                         </span>
            </div>
          </Link>
          {/*History Item */}
          <Link to="/dashboard?tab=history" onClick={() => setCloseOnClick(true)} className="relative">
            <div
                className={`
                            flex items-center  rounded-md p-2
                              hover:bg-gray-200 dark:hover:bg-gray-700
                              ${tab === "history" ? "bg-gray-200 dark:bg-gray-700" : " "}
                            `}
            >
                           <span className="flex items-center gap-2 ">
                               <HiDocumentText className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                             {isSidebarOpen && (
                                 <span className="text-gray-700 dark:text-gray-300">
                                   History
                                 </span>
                             )}
                           </span>
            </div>
          </Link>

          {/*Only admin user can see this links */}
          {currentUser.isAdmin && (
              <>
                {/*Project Dashboard */}
                <Link to="/dashboard?tab=projects"  onClick={() => setCloseOnClick(true)} className="relative">
                  <div
                      className={`
                                    flex items-center  rounded-md p-2
                                     hover:bg-gray-200 dark:hover:bg-gray-700
                                     ${
                          tab === "projects"
                              ? "bg-gray-200 dark:bg-gray-700"
                              : " "
                      }
                                  `}
                  >
                                <span className="flex items-center gap-2 ">
                                   <HiAnnotation className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                                  {isSidebarOpen && (
                                      <span className="text-gray-700 dark:text-gray-300">
                                           Project Dashboard
                                         </span>
                                  )}
                                  </span>
                  </div>
                </Link>
                {/* User Item */}
                <Link to="/dashboard?tab=users" onClick={() => setCloseOnClick(true)}  className="relative">
                  <div
                      className={`
                                    flex items-center rounded-md p-2
                                     hover:bg-gray-200 dark:hover:bg-gray-700
                                       ${
                          tab === "users"
                              ? "bg-gray-200 dark:bg-gray-700"
                              : " "
                      }
                                    `}
                  >
                                 <span className="flex items-center gap-2 ">
                                      <HiOutlineUserGroup className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                                   {isSidebarOpen && (
                                       <span className="text-gray-700 dark:text-gray-300">
                                        Users
                                      </span>
                                   )}
                                </span>
                  </div>
                </Link>
              </>
          )}
          {/* SignOut Item */}
          <div onClick={handleSignout} className="relative cursor-pointer">
            <div
                className={`
                             flex items-center  rounded-md p-2
                                 hover:bg-gray-200 dark:hover:bg-gray-700
                                `}
            >
                           <span className="flex items-center gap-2 ">
                              <HiArrowSmRight className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                             {isSidebarOpen && (
                                 <span className="text-gray-700 dark:text-gray-300">
                                   SignOut
                                </span>
                             )}
                          </span>
            </div>
          </div>
        </nav>
      </aside>
  );
}
export  default DashSidebar;