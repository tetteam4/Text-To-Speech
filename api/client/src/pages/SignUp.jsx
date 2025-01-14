import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoding] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out all fields.");
    }

    try {
      setLoding(true);
      setErrorMessage(null);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        setLoding(false);
        return setErrorMessage(data.message);
      }

      if (res.ok) {
        setTimeout(() => {
          navigate('/sign-in')
          setLoding(false);
        }, 1000)
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoding(false);
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
          <div className="flex-1">
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <div className="">
                <Label value="UseName" />
                <TextInput
                    type="text"
                    id="username"
                    placeholder="Name "
                    onChange={handleChange}
                />
              </div>

              <div className="">
                <Label value="Email" />
                <TextInput
                    type="email"
                    id="email"
                    placeholder="name@example.com"
                    onChange={handleChange}
                />
              </div>

              <div className="">
                <Label value=" Password" />
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
                      <Spinner size="sm" />
                      <span>Loding...</span>
                    </>
                ) : (
                    " Sign Up"
                )}
              </Button>
              <OAuth />
            </form>
            <div className="flex gap-2 text-sm mt-3">
              <span>If you have a previous account?</span>
              <Link to="/sign-in" className="text-blue-500">
                Login
              </Link>
            </div>
            <div>
              {errorMessage && (
                  <Alert className="mt-5" color="failure">
                    {errorMessage}
                  </Alert>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}