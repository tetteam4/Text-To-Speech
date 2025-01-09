// client/src/components/auth/Login.jsx
import React, { useState } from "react";
import Button from "../ui/Button";
import useStore from "../../store/store";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, loading, setError } = useStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
      console.error("Error on login", err);
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </Button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
        <p className="mt-4 text-center text-gray-500">
          Don't have an account?{" "}
          <a href="/signup" className="text-primary hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
