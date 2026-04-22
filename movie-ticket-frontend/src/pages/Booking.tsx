import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Booking } from "../types";
import "../styles/booking.css";

const MOCK_MOVIES: Record<string, { title: string; genre: string; duration: number; image: string }> = {
  M001: { title: "Avengers: Endgame", genre: "Action", duration: 181, image: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg" },
  M002: { title: "Spider-Man: No Way Home", genre: "Action", duration: 148, image: "https://i.ebayimg.com/images/g/Z8EAAOSwYSpi3vjf/s-l1200.jpg" },
  M003: { title: "The Batman", genre: "Crime", duration: 176, image: "https://cdn.europosters.eu/image/1300/133030.jpg" },
  M004: { title: "Oppenheimer", genre: "Biography", duration: 180, image: "https://m.media-amazon.com/images/I/91L+jiIFA3L.jpg" },
  M005: { title: "Interstellar", genre: "Sci-Fi", duration: 169, image: "https://m.media-amazon.com/images/I/91obuWzA3XL.jpg" },
  M006: { title: "Dune: Part Two", genre: "Sci-Fi", duration: 166, image: "https://m.media-amazon.com/images/M/MV5BNTc0YmQxMjEtODI5MC00NjFiLTlkMWUtOGQ5NjFmYWUyZGJhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
};

const SHOWTIME_OPTIONS = ["10:00", "13:30", "16:00", "19:30", "22:00"];
const TICKET_PRICE = 85_000;

const BookingPage: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();

  const movie = movieId ? MOCK_MOVIES[movieId] : null;

  const [seats, setSeats] = useState<number>(1);
  const [showtime, setShowtime] = useState<string>(SHOWTIME_OPTIONS[0]);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const total = seats * TICKET_PRICE;

  const handleBooking = () => {
    if (!movieId) { setError("Không tìm thấy phim"); return; }
    if (seats <= 0) { setError("Số ghế phải lớn hơn 0"); return; }

    setError("");
    setLoading(true);
    console.log("EVENT: BOOKING_CREATED");

    const newBooking: Booking = {
      id: Date.now(),
      movieId: Number(movieId.replace("M", "")),
      seats,
      status: "PENDING",
    };
    setBooking(newBooking);

    setTimeout(() => {
      const success = Math.random() > 0.5;
      setBooking((prev) => prev ? { ...prev, status: success ? "SUCCESS" : "FAILED" } : null);
      console.log(success ? "EVENT: PAYMENT_SUCCESS" : "EVENT: PAYMENT_FAILED");
      setLoading(false);
      setTimeout(() => navigate("/movies"), 2200);
    }, 2000);
  };

  return (
    <div className="booking-wrapper">
      {/* ── Page Header ── */}
      <div className="booking-header">
        <p className="booking-eyebrow">Premium Cinema</p>
        <h1 className="booking-title">ĐẶT VÉ XEM PHIM</h1>
        <div className="booking-line" />
      </div>

      <div className="booking-layout">
        {/* ── Left: Movie Info Panel ── */}
        <div className="movie-info-panel">
          <div className="corner corner-tl" />
          <div className="corner corner-br" />
          <div className="ticket-strip" />

          {movie ? (
            <>
              <div className="info-poster-wrap">
                <img className="info-poster-img" src={movie.image} alt={movie.title} />
                <div className="info-poster-overlay" />
                <div className="info-poster-badge">NOW SHOWING</div>
              </div>
              <div className="info-body">
                <div className="info-title">{movie.title}</div>
                <div className="info-meta-row">
                  <span className="info-meta-tag">{movie.genre}</span>
                  <span className="meta-sep" />
                  <span className="info-meta-tag">{movie.duration} phút</span>
                </div>
                <div className="info-divider" />
                <div className="info-stat-row">
                  <span className="info-stat-label">Mã phim</span>
                  <span className="info-stat-val">{movieId}</span>
                </div>
                <div className="info-stat-row">
                  <span className="info-stat-label">Giá / ghế</span>
                  <span className="info-stat-val gold">{TICKET_PRICE.toLocaleString("vi-VN")} ₫</span>
                </div>
              </div>
            </>
          ) : (
            <div className="info-body">
              <div className="info-title">Phim #{movieId}</div>
            </div>
          )}
        </div>

        {/* ── Right: Booking Form ── */}
        <div className="booking-form-panel">
          <div className="corner corner-tl" />
          <div className="corner corner-br" />

          {/* Showtime */}
          <div className="form-section">
            <label className="form-label">CHỌN GIỜ CHIẾU</label>
            <div className="showtime-grid">
              {SHOWTIME_OPTIONS.map((t) => (
                <button
                  key={t}
                  className={`showtime-btn ${showtime === t ? "active" : ""}`}
                  onClick={() => setShowtime(t)}
                  disabled={loading}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Seat Count */}
          <div className="form-section">
            <label className="form-label">SỐ LƯỢNG GHẾ</label>
            <div className="seat-counter">
              <button
                className="counter-btn"
                onClick={() => setSeats((s) => Math.max(1, s - 1))}
                disabled={loading || seats <= 1}
              >−</button>
              <span className="counter-value">{seats}</span>
              <button
                className="counter-btn"
                onClick={() => setSeats((s) => Math.min(10, s + 1))}
                disabled={loading || seats >= 10}
              >+</button>
            </div>
            <p className="seat-hint">Tối đa 10 ghế / lần đặt</p>
          </div>

          {/* Summary */}
          <div className="booking-summary">
            <div className="summary-row">
              <span className="summary-label">Suất chiếu</span>
              <span className="summary-val">{showtime}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">{seats} ghế × {TICKET_PRICE.toLocaleString("vi-VN")} ₫</span>
              <span className="summary-val gold">{total.toLocaleString("vi-VN")} ₫</span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="booking-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {/* CTA */}
          <button
            className="confirm-btn"
            onClick={handleBooking}
            disabled={loading}
          >
            {loading ? (
              <span className="btn-loading">
                <span className="spinner" />
                ĐANG XỬ LÝ...
              </span>
            ) : "XÁC NHẬN ĐẶT VÉ"}
          </button>

          <button className="back-link" onClick={() => navigate("/movies")} disabled={loading}>
            ← Quay lại danh sách phim
          </button>
        </div>
      </div>

      {/* ── Result Overlay ── */}
      {booking && booking.status !== "PENDING" && (
        <div className="result-overlay">
          <div className={`result-card ${booking.status === "SUCCESS" ? "success" : "failed"}`}>
            <div className="corner corner-tl" />
            <div className="corner corner-br" />
            <div className="ticket-strip" />

            <div className="result-icon">
              {booking.status === "SUCCESS" ? (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
                  <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
                </svg>
              )}
            </div>

            <div className="result-title">
              {booking.status === "SUCCESS" ? "ĐẶT VÉ THÀNH CÔNG" : "THANH TOÁN THẤT BẠI"}
            </div>
            <div className="result-sub">
              {booking.status === "SUCCESS"
                ? `Booking #${booking.id} — ${seats} ghế — ${showtime}`
                : "Vui lòng thử lại hoặc chọn phương thức khác"}
            </div>
            <div className="result-redirect">Đang chuyển hướng...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;