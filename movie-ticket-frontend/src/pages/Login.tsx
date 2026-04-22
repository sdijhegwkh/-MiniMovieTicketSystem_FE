import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

/* ─── FilmStrip sub-component ────────────────────────────── */
interface FilmStripProps {
  left: string;
  dur: number;
  delay: number;
  r: number;
  h: number;
}

const FilmStrip: React.FC<FilmStripProps> = ({ left, dur, delay, r, h }) => (
  <div
    className="film-strip"
    style={
      {
        left,
        height: `${h}px`,
        "--dur": `${dur}s`,
        "--delay": `${delay}s`,
        "--r": `${r}deg`,
      } as React.CSSProperties
    }
  />
);

/* ─── Login page ──────────────────────────────────────────── */
const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail]       = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading]   = useState<boolean>(false);
  const [error, setError]       = useState<string>("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    setError("");
    setLoading(true);

    console.log("CALL API: /login", { email, password });

    setTimeout(() => {
      setLoading(false);
      console.log("LOGIN SUCCESS");
      alert("Đăng nhập thành công");
      navigate("/movies");
    }, 1500);
  };

  return (
    <div className="login-wrapper">
      {/* Background layers */}
      <div className="bg-layer" />
      <div className="spotlight" />

      {/* Floating film strips */}
      <FilmStrip left="5%"  dur={14} delay={0}   r={-3} h={320} />
      <FilmStrip left="15%" dur={18} delay={-5}  r={2}  h={240} />
      <FilmStrip left="55%" dur={22} delay={-12} r={-2} h={200} />
      <FilmStrip left="75%" dur={16} delay={-8}  r={-1} h={280} />
      <FilmStrip left="88%" dur={20} delay={-3}  r={3}  h={360} />

      {/* Starfield */}
      <svg className="stars" aria-hidden="true">
        {Array.from({ length: 60 }, (_, i) => (
          <circle
            key={i}
            cx={`${Math.random() * 100}%`}
            cy={`${Math.random() * 100}%`}
            r={Math.random() * 1.2 + 0.3}
            fill="rgba(240,236,224,0.25)"
            style={{ opacity: Math.random() * 0.6 + 0.1 }}
          />
        ))}
      </svg>

      {/* Card */}
      <div className="login-card">
        <div className="corner corner-tl" />
        <div className="corner corner-br" />
        <div className="ticket-strip" />

        {/* Logo */}
        <div className="logo-area">
          <p className="logo-eyebrow">Premium Cinema</p>
          <h1 className="logo-title">CINEMAX</h1>
          <div className="logo-line" />
        </div>

        {/* Error */}
        {error && (
          <div className="error-msg">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8"  x2="12"    y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* Email */}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            placeholder="ten@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        {/* Password */}
        <div className="form-group">
          <label className="form-label">Mật khẩu</label>
          <input
            className="form-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        {/* Forgot password */}
        <div style={{ textAlign: "right", marginBottom: 20, marginTop: -8 }}>
          <span className="footer-link" style={{ fontSize: 11 }}>
            Quên mật khẩu?
          </span>
        </div>

        {/* Submit */}
        <button className="login-btn" onClick={handleLogin} disabled={loading}>
          {loading ? "ĐANG XÁC THỰC..." : "VÀO RẠP"}
          {loading && <span className="btn-loading-bar" />}
        </button>

        {/* Divider */}
        <div className="divider">
          <div className="divider-line" />
          <span className="divider-text">hoặc</span>
          <div className="divider-line" />
        </div>

        {/* Footer */}
        <div className="card-footer">
          <p className="footer-text">
            Chưa có tài khoản?{" "}
            <span className="footer-link">Đăng ký ngay</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
