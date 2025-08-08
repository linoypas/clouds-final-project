import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Login.css";
import logo from "../../assets/logo.png";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; 
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch("https://localhost:443/auth/register", {
        method: "POST",
        body: formData, 
      });

      if (response.ok) {
        console.log("Registered successfully!");
        navigate("/login");
      } else {
        console.log("Registration failed.");
      }
    } catch (error) {
      console.error("Error during register:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <h2>Register</h2>

      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          required
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          required
        />
        <input type="file" name="image" accept="image/*" onChange={handleFileChange} />
        <button type="submit" className="submit-button">
          Register
        </button>
      </form>

      <p className="register-link">
        Already have an account?
        <button onClick={() => navigate("/login")} className="register-button">
          Login here
        </button>
      </p>
    </div>
  );
};

export default Register;
