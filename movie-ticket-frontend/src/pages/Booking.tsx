import { useParams } from "react-router-dom";
import { useState } from "react";
import type { Booking } from "../types";
import { useNavigate } from "react-router-dom";
const BookingPage: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();

  const [seats, setSeats] = useState<number>(1);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
const navigate = useNavigate();
  const handleBooking = () => {
  // 1. VALIDATE
  if (!movieId) {
    setError("Không tìm thấy phim");
    return;
  }

  if (seats <= 0) {
    setError("Số ghế phải lớn hơn 0");
    return;
  }

  // 2. RESET ERROR + LOADING
  setError("");
  setLoading(true);

  // 3. BOOKING CREATED (EVENT)
  console.log("EVENT: BOOKING_CREATED");

  const newBooking = {
    id: Date.now(),
    movieId: Number(movieId),
    seats,
    status: "PENDING" as const,
  };

  setBooking(newBooking);

  // 4. SIMULATE PAYMENT SERVICE (ASYNC)
  setTimeout(() => {
    const success = Math.random() > 0.5;

    // 5. UPDATE BOOKING STATUS
    setBooking((prev) =>
      prev
        ? {
            ...prev,
            status: success ? "SUCCESS" : "FAILED",
          }
        : null
    );

    // 6. PAYMENT EVENT LOG
    console.log(
      success ? "EVENT: PAYMENT_SUCCESS" : "EVENT: PAYMENT_FAILED"
    );

    setLoading(false);

    // 7. OPTIONAL NAVIGATION (demo flow)
    navigate("/movies");
  }, 2000);
};

  return (
    <div style={{ padding: 20 }}>
      <h2>Đặt vé phim ID: {movieId}</h2>

      {/* INPUT */}
      <div style={{ marginBottom: 10 }}>
        <label>Số ghế: </label>
        <input
          type="number"
          value={seats}
          min={1}
          onChange={(e) => setSeats(Number(e.target.value))}
        />
      </div>

      {/* BUTTON */}
      <button onClick={handleBooking} disabled={loading}>
        {loading ? "Đang xử lý..." : "Đặt vé"}
      </button>

      {/* ERROR */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* RESULT */}
      {booking && (
        <div style={{ marginTop: 20 }}>
          <p><b>Booking ID:</b> {booking.id}</p>
          <p><b>Số ghế:</b> {booking.seats}</p>

          <p>
            <b>Trạng thái:</b>{" "}
            {booking.status === "PENDING" && "⏳ Đang xử lý"}
            {booking.status === "SUCCESS" && "✅ Thành công"}
            {booking.status === "FAILED" && "❌ Thất bại"}
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingPage;