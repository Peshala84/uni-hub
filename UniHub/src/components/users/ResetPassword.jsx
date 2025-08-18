import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

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
  message: {
    marginTop: "16px",
    fontWeight: "600",
    fontSize: "1rem",
  },
};

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const [isFocusedConfirm, setIsFocusedConfirm] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:8086/api/v1/user/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      if (!res.ok) throw new Error("Invalid or expired token");

      setMessage("Password reset successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.popup} role="dialog" aria-modal="true" aria-labelledby="resetPasswordTitle">
        <h2 id="resetPasswordTitle" style={styles.heading}>
          Reset Password
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              ...styles.input,
              ...(isFocusedPassword ? styles.inputFocus : {}),
            }}
            onFocus={() => setIsFocusedPassword(true)}
            onBlur={() => setIsFocusedPassword(false)}
            aria-describedby="passwordHelp"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{
              ...styles.input,
              ...(isFocusedConfirm ? styles.inputFocus : {}),
            }}
            onFocus={() => setIsFocusedConfirm(true)}
            onBlur={() => setIsFocusedConfirm(false)}
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
            Reset Password
          </button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}
