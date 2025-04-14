import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");

  const handleLogin = () => {
    // Only allow the authorized email
    if (email === "mayurgk2006@gmail.com") {
      const fakeToken = "your-hardcoded-jwt-token"; // Use a real token from backend or jwt.io
      localStorage.setItem("token", fakeToken);
      window.location.href = "/dashboard";
    } else {
      alert("Unauthorized email");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email"
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
