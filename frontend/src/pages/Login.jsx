import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");

  const handleLogin = () => {
    if (email === "mayurgk2006@gmail.com") {
      const fakeToken = "your-hardcoded-jwt-token"; // Ideally from backend
      localStorage.setItem("token", fakeToken);
      window.location.href = "/dashboard";
    } else {
      alert("Unauthorized email");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
