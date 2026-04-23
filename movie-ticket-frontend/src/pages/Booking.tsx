import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/booking.css";

const MOVIE_API = "http://localhost:8082";
const BOOKING_API = "http://localhost:8083";

const SHOWTIME_OPTIONS = ["10:00", "13:30", "16:00", "19:30", "22:00"];
const TICKET_PRICE = 85_000;

/* ─── Types ───────────────────────────────────────────────── */
interface MovieInfo {
  movieId: string;
  title: string;
  genre: string;
  duration: number;
  poster?: string;
  status: string;
}

interface BookingResult {
  _id: string;
  userId: string | number;
  movieId: string;
  seatNumber: string;
  status: string;
}

/* ─── BookingPage ─────────────────────────────────────────── */
const BookingPage: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<MovieInfo | null>(null);
  const [movieLoading, setMovieLoading] = useState<boolean>(true);
  const [movieError, setMovieError] = useState<string>("");

  const [seats, setSeats] = useState<number>(1);
  const [showtime, setShowtime] = useState<string>(SHOWTIME_OPTIONS[0]);

  const [bookingResult, setBookingResult] = useState<BookingResult | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const total = seats * TICKET_PRICE;

  /* ── Fetch movie info ── */
  useEffect(() => {
    if (!movieId) return;

    const fetchMovie = async () => {
      try {
        // Thử GET /movies/:movieId trước (nhanh hơn)
        const directRes = await fetch(`${MOVIE_API}/movies/${movieId}`);
        if (directRes.ok) {
          const data: MovieInfo = await directRes.json();
          setMovie(data);
          return;
        }

        // Fallback: GET /movies rồi filter
        const res = await fetch(`${MOVIE_API}/movies`);
        if (!res.ok) throw new Error("Không tải được thông tin phim.");
        const data: MovieInfo[] = await res.json();
        const found = data.find((m) => m.movieId === movieId);
        if (!found) throw new Error(`Không tìm thấy phim "${movieId}".`);
        setMovie(found);
      } catch (err: unknown) {
        setMovieError(
          err instanceof Error ? err.message : "Lỗi không xác định.",
        );
      } finally {
        setMovieLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  /* ── Submit booking ── */
  const handleBooking = async () => {
    if (!movieId) {
      setError("Không tìm thấy mã phim.");
      return;
    }
    if (seats <= 0) {
      setError("Số ghế phải lớn hơn 0.");
      return;
    }

    setError("");
    setLoading(true);

    const stored = localStorage.getItem("user");
    const userObj = stored ? JSON.parse(stored) : null;
    const userId = userObj?._id ?? userObj?.id ?? userObj?.userId ?? 0;

    // Tạo seatNumber: "A1, A2, A3"
    const seatLabels = Array.from(
      { length: seats },
      (_, i) => `${showtime.replace(":", "")}–S${i + 1}`,
    ).join(", ");

    try {
      const res = await fetch(`${BOOKING_API}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          movieId, // ✅ giữ nguyên string "M002", KHÔNG convert số
          seatNumber: seatLabels,
          seats,
          showtime,
          totalPrice: total,
          status: "PENDING",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Đặt vé thất bại.");
      }

      const data: BookingResult = await res.json();

      // Giả lập payment delay
      setTimeout(() => {
        setBookingResult({ ...data, status: "SUCCESS" });
        setLoading(false);
        setTimeout(() => navigate("/my-tickets"), 2200);
      }, 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Lỗi không xác định.");
      setLoading(false);
    }
  };

  /* ── Render ── */
  return (
    <div className="booking-wrapper">
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

          {movieLoading ? (
            <div className="info-body">
              <div className="skeleton-line w70" style={{ marginBottom: 12 }} />
              <div className="skeleton-line w50" />
            </div>
          ) : movieError ? (
            <div className="info-body">
              <p className="booking-error" style={{ marginTop: 16 }}>
                {movieError}
              </p>
            </div>
          ) : movie ? (
            <>
              <div className="info-poster-wrap">
                {movie.poster ? (
                  <img
                    className="info-poster-img"
                    src={movie.poster}
                    alt={movie.title}
                  />
                ) : (
                  <div
                    className="info-poster-img"
                    style={{
                      background: "rgba(201,168,76,0.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "rgba(201,168,76,0.4)",
                      fontSize: 12,
                      letterSpacing: "0.1em",
                    }}
                  >
                    NO POSTER
                  </div>
                )}
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
                  <span className="info-stat-val gold">
                    {TICKET_PRICE.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* ── Right: Booking Form ── */}
        <div className="booking-form-panel">
          <div className="corner corner-tl" />
          <div className="corner corner-br" />

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

          <div className="form-section">
            <label className="form-label">SỐ LƯỢNG GHẾ</label>
            <div className="seat-counter">
              <button
                className="counter-btn"
                onClick={() => setSeats((s) => Math.max(1, s - 1))}
                disabled={loading || seats <= 1}
              >
                −
              </button>
              <span className="counter-value">{seats}</span>
              <button
                className="counter-btn"
                onClick={() => setSeats((s) => Math.min(10, s + 1))}
                disabled={loading || seats >= 10}
              >
                +
              </button>
            </div>
            <p className="seat-hint">Tối đa 10 ghế / lần đặt</p>
          </div>

          <div className="booking-summary">
            <div className="summary-row">
              <span className="summary-label">Suất chiếu</span>
              <span className="summary-val">{showtime}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">
                {seats} ghế × {TICKET_PRICE.toLocaleString("vi-VN")} ₫
              </span>
              <span className="summary-val gold">
                {total.toLocaleString("vi-VN")} ₫
              </span>
            </div>
          </div>

          {error && (
            <div className="booking-error">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <button
            className="confirm-btn"
            onClick={handleBooking}
            disabled={loading || movieLoading || !!movieError}
          >
            {loading ? (
              <span className="btn-loading">
                <span className="spinner" />
                ĐANG XỬ LÝ...
              </span>
            ) : (
              "XÁC NHẬN ĐẶT VÉ"
            )}
          </button>

          <button
            className="back-link"
            onClick={() => navigate("/movies")}
            disabled={loading}
          >
            ← Quay lại danh sách phim
          </button>
        </div>
      </div>

      {/* ── Result Overlay ── */}
      {bookingResult && bookingResult.status !== "PENDING" && (
        <div className="result-overlay">
          <div
            className={`result-card ${bookingResult.status === "SUCCESS" ? "success" : "failed"}`}
          >
            <div className="corner corner-tl" />
            <div className="corner corner-br" />
            <div className="ticket-strip" />

            <div className="result-icon">
              {bookingResult.status === "SUCCESS" ? (
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    d="M20 6L9 17l-5-5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
                  <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
                </svg>
              )}
            </div>

            <div className="result-title">
              {bookingResult.status === "SUCCESS"
                ? "ĐẶT VÉ THÀNH CÔNG"
                : "THANH TOÁN THẤT BẠI"}
            </div>
            <div className="result-sub">
              {bookingResult.status === "SUCCESS"
                ? `Booking #${bookingResult._id.slice(-6).toUpperCase()} — ${seats} ghế — ${showtime}`
                : "Vui lòng thử lại hoặc chọn phương thức khác"}
            </div>
            <div className="result-redirect">
              Đang chuyển hướng về trang vé của bạn...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
