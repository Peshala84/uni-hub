import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)", // Dimmed background
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  popup: {
    backgroundColor: "#fff",
    padding: "40px 50px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
    width: "90%",
    maxWidth: "400px",
    textAlign: "center",
    position: "relative",
  },
  heading: {
    marginBottom: "24px",
    color: "#222",
    fontWeight: "700",
    fontSize: "1.8rem",
  },
  input: {
    width: "100%",
    padding: "14px 20px",
    fontSize: "16px",
    border: "1.5px solid #ccc",
    borderRadius: "8px",
    marginBottom: "24px",
    transition: "border-color 0.3s",
    boxSizing: "border-box",
  },
  inputFocus: {
    borderColor: "#3b82f6",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "14px 20px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "700",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.25s ease",
  },
  buttonHover: {
    backgroundColor: "#1e40af",
  },
  closeBtn: {
    position: "absolute",
    top: "12px",
    right: "16px",
    fontSize: "24px",
    color: "#999",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    transition: "color 0.3s",
  },
  closeBtnHover: {
    color: "#555",
  },
};

function ForgotPassword({ onClose }) {
  const [email, setEmail] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isCloseHovered, setIsCloseHovered] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    try {
      const response = await axios.post(
        "http://localhost:8086/api/v1/user/forgot-password",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      alert("Password reset email sent!");
      // navigate("/reset-password"); // redirect to reset password page
      if (onClose) onClose(); // Close popup after success if callback provided
    } catch (error) {
      console.error("AxiosError:", error);
      alert("Error sending reset email");
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.popup} role="dialog" aria-modal="true" aria-labelledby="forgotPasswordTitle">
        <button
          onClick={onClose}
          style={{ ...styles.closeBtn, ...(isCloseHovered ? styles.closeBtnHover : {}) }}
          onMouseEnter={() => setIsCloseHovered(true)}
          onMouseLeave={() => setIsCloseHovered(false)}
          aria-label="Close popup"
          type="button"
        >
          &times;
        </button>
        <h2 id="forgotPasswordTitle" style={styles.heading}>
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              ...styles.input,
              ...(isFocused ? styles.inputFocus : {}),
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-describedby="emailHelp"
          />
          <button
            type="submit"
            style={{
              ...styles.button,
              ...(isButtonHovered ? styles.buttonHover : {}),
            }}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
