import { Alert, Button, Spinner, Label, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const {
    loading,
    error: errorMessage,
    currentUser,
  } = useSelector((state) => state.user);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (currentUser && !currentUser.isVerified) {
      setShowVerificationMessage(true);
    } else {
      setShowVerificationMessage(false);
    }
    if(errorMessage){
      const timer = setTimeout(() => {
        setLocalError(null)
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentUser, errorMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setLocalError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill in all fields."));
    }
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }
      if (res.ok) {
        dispatch(signInSuccess(data));
        setTimeout(() => {
          navigate("/");
        }, 1000)
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
      setLocalError(error.message);
    }
  };


  return (
      <div className="min-h-screen mt-20">
        <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
          {/* left */}
          <div className="flex-1">
            <Link to="/" className="font-bold dark:text-white text-4xl">
                        <span className="py-2 px-4  text-white  rounded-lg bg-primary">
                            TET
                         </span>
              TTS App
            </Link>
            <p className="text-2xl mt-5">
              You can sign up with your email and password or with a Google
              account{" "}
            </p>
          </div>
          {/* right */}
          <div className=" flex-1">
            <form className="flex flex-col gap-3 signin" onSubmit={handleSubmit}>
              <div className="">
                <Label value="Email" />
                <TextInput
                    type="email"
                    id="email"
                    placeholder="company@exampel.com"
                    onChange={handleChange}
                />
              </div>

              <div className="">
                <Label value=" Passwrod" />
                <TextInput
                    type="password"
                    id="password"
                    placeholder="**********"
                    onChange={handleChange}
                />
              </div>
              <Button
                  gradientDuoTone="purpleToPink"
                  type="submit"
                  disabled={loading}
              >
                {loading ? (
                    <>
                      {" "}
                      <Spinner size="sm" /> <span>Loding...</span>{" "}
                    </>
                ) : (
                    "SignIn"
                )}
              </Button>

              <OAuth />
            </form>
            {showVerificationMessage && (
                <Alert className="mt-5" color="warning">
                  Please verify your email first
                </Alert>
            )}

            <div className="flex gap-2 text-sm mt-3">
              <span>Don't have an account?</span>

              <Link to="/sign-up" className="text-blue-500">
                {" "}
                SignUp{" "}
              </Link>
            </div>
            <div>
              {errorMessage && (
                  <Alert className="mt-5" color="failure">
                    {" "}
                    {errorMessage }
                  </Alert>
              )}
              {localError && l(
                  <Alert className="mt-5" color="failure">
                    {" "}
                    {localError }
                  </Alert>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}