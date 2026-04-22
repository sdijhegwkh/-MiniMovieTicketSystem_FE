import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Register: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const handleRegister = () => {
  console.log("EVENT: USER_REGISTERED");

  alert("Đăng ký thành công");

  // 👉 CHUYỂN LUỒNG
  navigate("/login");
};

  return (
    <div>
      <h2>Register</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />

      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;