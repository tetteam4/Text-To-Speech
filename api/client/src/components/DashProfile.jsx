import { useSelector } from "react-redux";
import { useDispatch} from "react-redux";
import { Alert, Button, Label, Modal, Textarea, TextInput } from "flowbite-react";
import { useState, useRef, useEffect } from "react";
import { HiOutlineExclamationCircle} from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { getDownloadURL,getStorage,ref,uploadBytesResumable,} from "firebase/storage";
import { app } from "../firbase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateFailure,
  updateStart,
  updateSuccess,
  deleteUserStart,
  deleteUserFailure,
  signOutSuccess,
  deleteUserSuccess,
} from "../redux/user/userSlice";


export default function DashProfile() {
  const {currentUser,error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [ImageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateuserError, setUpdateUserError] = useState(null);
  const [showModale,setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const navgete=useNavigate();




  ////// its temperary in browser save on localStorage
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
    };

  useEffect(() => {
    if (imageFile) upLoadImage();
  }, [imageFile]);
  

  const upLoadImage = async () => {

    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      () => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 5 MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUploadError(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };


  /////////////////// input handler for updating
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    // console.log(currentUser._id);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Not yet loaded");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("Your profile is  successfully changed");

        setTimeout(() => {
          setUpdateUserSuccess("");
        }, 3000);
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  };



  /////////////////////Delete user accounts
  const handleDeleteUser= async()=>{
    setShowModal(false)
    try {  
      dispatch(deleteUserStart())
      const res = await fetch(`api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      }
      else {
        dispatch(deleteUserSuccess(data));
        navgete('/')
      
      }
      } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }


  ////////////////////////////// handle sign  out 
  const handleSignout= async () =>{
    try {
      const res= await fetch('api/user/signout',{
         method:"POST",
      });
      const data= await res.json();

      if(!res.ok){
       console.log(data.message);
      }
      else{
        dispatch(signOutSuccess());
        navgete('/')
      }
      } catch (error) {
      console.log(error.message);
    }  
  }


  return (
    <div className="max-w-lg mx-auto p-3 w-full pt-16">
      <h1 className="my-7 text-center font-semibold text-3xl">profile</h1>
      {/*///////////////////////////////////// from start  */}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 dashProfilr"
        >
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
            ref={filePickerRef}
          />
          <div
            className=" relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
            onClick={() => filePickerRef.current.click()}
          >
            {imageFileUploadProgress && (
              <CircularProgressbar
                value={imageFileUploadProgress || 0}
                text={`${imageFileUploadProgress}%`}
                strokeWidth={5}
                styles={{
                  root: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  },
                  path: {
                    stroke: `rgba(62,152,199,${imageFileUploadProgress / 100})`,
                  },
                }}
              />
            )}

            <img
              src={ImageFileUrl || currentUser.profilePicture}
              alt="user"
              className={`rounded-full w-full h-full object-cover border-8 border-[lightgray]
             ${
               imageFileUploadProgress &&
               imageFileUploadProgress < 100 &&
               "opacity-60"
             }`}
            />
          </div>
          {/* alert error */}
          {imageFileUploadError && (
            <Alert color="failure">{imageFileUploadError}</Alert>
          )}
          <TextInput
            type="text"
            id="username"
            placeholder="username"
            defaultValue={currentUser.username || currentUser.firstName}
            onChange={handleChange}
          />
          <TextInput
            type="email"
            id="email"
            placeholder="email"
            defaultValue={currentUser.email}
            onChange={handleChange}
          />
          <TextInput
            type="password"
            id="password"
            placeholder=""
            onChange={handleChange}
          />
          <Button
            type="submit"
            gradientDuoTone="purpleToBlue"
            outline
            disabled={loading || imageFileUploading}
          >
            {loading ? "Loading..." : "  Updating"}
          </Button>
        </form>
      )}

      <div className="text-red-500 flex justify-between mt-5">
        <span
          onClick={() => setShowModal(true)}
          className="cursor-pointer font-bold"
        >
          ِDelete Acount
        </span>
        <span
          onClick={() => setShowModal(true)}
          className="cursor-pointer font-bold"
        >
          {" "}
          SignOut{" "}
        </span>
      </div>

      {updateUserSuccess && (
        <Alert className="mt-5" color="success">
          {" "}
          {updateUserSuccess}{" "}
        </Alert>
      )}
      {updateuserError && (
        <Alert className="mt-5" color="failure">
          {" "}
          {updateuserError}{" "}
        </Alert>
      )}
      {error && (
        <Alert className="mt-5" color="failure">
          {" "}
          {error}{" "}
        </Alert>
      )}

      <Modal
        show={showModale}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-500 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you can delete your account?؟
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                {" "}
                Yes
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                {" "}
                No
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={showModale}
        onClose={() => setShowModal(false)}
        popupsize="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-500 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              {" "}
              Sign out of your account?{" "}
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleSignout}>
                {" "}
                Yes{" "}
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                {" "}
                No
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
