import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/mytickets.css";
import React from "react";

/* ─── Config ──────────────────────────────────────────────── */
const BOOKING_API = "http://192.168.1.6:8083";
const MOVIE_API = "http://192.168.1.6:8082";
const PAYMENT_API = "http://192.168.1.6:8085";

/* ─── Types ───────────────────────────────────────────────── */
interface RawBooking {
  _id: string;
  userId: number | string;
  movieId: number | string;
  seatNumber: string;
  seats?: number;
  showtime?: string;
  totalPrice?: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  createdAt: string;
  __v?: number;
}

interface Movie {
  _id?: string;
  movieId: string | number;
  title: string;
  poster?: string;
  genre?: string;
  duration?: number;
  status?: string;
}

interface EnrichedBooking extends RawBooking {
  movieTitle: string;
  moviePoster?: string;
  movieGenre?: string;
}

interface Toast {
  id: number;
  type: "success" | "error" | "loading";
  title: string;
  message: string;
}

/* ─── Helpers ─────────────────────────────────────────────── */
const TICKET_PRICE = 85_000;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount,
  );

const getSeatCount = (b: RawBooking) =>
  b.seats ?? b.seatNumber?.split(",").filter(Boolean).length ?? 1;

const getPrice = (b: RawBooking) =>
  b.totalPrice ?? getSeatCount(b) * TICKET_PRICE;

const STATUS_MAP: Record<
  RawBooking["status"],
  { label: string; cls: string; icon: string }
> = {
  SUCCESS: { label: "Thành công", cls: "status-success", icon: "✓" },
  PENDING: { label: "Chờ xác nhận", cls: "status-pending", icon: "·" },
  FAILED: { label: "Thất bại", cls: "status-failed", icon: "✕" },
};

const findMovie = (
  movies: Movie[],
  bookingMovieId: number | string,
): Movie | undefined => {
  const bid = String(bookingMovieId);
  return movies.find((m) => {
    if (m._id && m._id === bid) return true;
    // eslint-disable-next-line eqeqeq
    if (m.movieId == bookingMovieId) return true;
    if (String(m.movieId) === bid) return true;
    return false;
  });
};

/* ─── Toast Component ─────────────────────────────────────── */
const ToastContainer = ({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: number) => void;
}) => (
  <div className="mt-toast-container">
    {toasts.map((t) => (
      <div key={t.id} className={`mt-toast mt-toast-${t.type}`}>
        <div className="mt-toast-icon">
          {t.type === "success" && (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                d="M20 6L9 17l-5-5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {t.type === "error" && (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
              <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
            </svg>
          )}
          {t.type === "loading" && <div className="mt-toast-spinner" />}
        </div>
        <div className="mt-toast-body">
          <div className="mt-toast-title">{t.title}</div>
          <div className="mt-toast-message">{t.message}</div>
        </div>
        {t.type !== "loading" && (
          <button className="mt-toast-close" onClick={() => onRemove(t.id)}>
            ×
          </button>
        )}
      </div>
    ))}
  </div>
);

/* ─── Skeleton ────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="mt-ticket-card mt-skeleton">
    <div className="mt-ticket-left mt-skel-poster" />
    <div className="mt-ticket-body">
      <div
        className="mt-skel-line"
        style={{ width: "55%", marginBottom: "10px" }}
      />
      <div className="mt-skel-line" style={{ width: "35%" }} />
      <div className="mt-skel-line" style={{ width: "70%" }} />
      <div className="mt-skel-line" style={{ width: "45%" }} />
    </div>
    <div className="mt-ticket-right">
      <div
        className="mt-skel-line"
        style={{ width: "80%", marginBottom: "8px" }}
      />
      <div className="mt-skel-line" style={{ width: "60%" }} />
    </div>
  </div>
);

/* ─── Empty ───────────────────────────────────────────────── */
const Empty = ({ filtered }: { filtered: boolean }) => (
  <div className="mt-empty">
    <div className="mt-empty-icon">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path
          d="M2 9V6a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v3a2 2 0 0 0 0 6v3
                 a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-3a2 2 0 0 0 0-6z"
        />
        <line x1="9" y1="3" x2="9" y2="21" strokeDasharray="3 3" />
      </svg>
    </div>
    <p className="mt-empty-title">
      {filtered ? "Không có vé nào trong mục này" : "Bạn chưa đặt vé nào"}
    </p>
    {!filtered && (
      <p className="mt-empty-sub">Hãy chọn phim và đặt vé để thưởng thức!</p>
    )}
  </div>
);

/* ─── Ticket Card ─────────────────────────────────────────── */
const TicketCard = ({
  booking,
  onPay,
  paying,
}: {
  booking: EnrichedBooking;
  onPay: (bookingId: string) => void;
  paying: boolean;
}) => {
  const st = STATUS_MAP[booking.status] ?? STATUS_MAP["PENDING"];
  const seats = booking.seatNumber
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const price = getPrice(booking);
  const shortId = booking._id.slice(-6).toUpperCase();
  const canPay = booking.status === "PENDING";

  return (
    <div
      className={`mt-ticket-card ${booking.status === "FAILED" ? "mt-ticket-failed" : ""}`}
    >
      <div className="mt-notch mt-notch-t" />
      <div className="mt-notch mt-notch-b" />

      {/* ── Left: poster ── */}
      <div className="mt-ticket-left">
        {booking.moviePoster ? (
          <>
            <img
              src={booking.moviePoster}
              alt={booking.movieTitle}
              className="mt-poster-img"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const next = e.currentTarget
                  .nextElementSibling as HTMLElement | null;
                if (next) next.style.display = "flex";
              }}
            />
            <div className="mt-poster-placeholder" style={{ display: "none" }}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
              >
                <rect x="2" y="3" width="20" height="18" rx="1.5" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
          </>
        ) : (
          <div className="mt-poster-placeholder">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
            >
              <rect x="2" y="3" width="20" height="18" rx="1.5" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
        {booking.movieGenre && (
          <span className="mt-genre-tag">{booking.movieGenre}</span>
        )}
      </div>

      <div className="mt-divider-dashed" />

      {/* ── Middle: info ── */}
      <div className="mt-ticket-body">
        <div className="mt-movie-title">{booking.movieTitle}</div>

        <span className={`mt-status-badge ${st.cls}`}>
          <span className="mt-status-icon">{st.icon}</span>
          {st.label}
        </span>

        <div className="mt-info-grid">
          <div className="mt-info-row">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>{formatDate(booking.createdAt)}</span>
            <span className="mt-dot">·</span>
            <span>{formatTime(booking.createdAt)}</span>
          </div>

          {booking.showtime && (
            <div className="mt-info-row">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span>Suất chiếu: {booking.showtime}</span>
            </div>
          )}

          <div className="mt-info-row mt-seats-row">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 12V22H4V12" />
              <path d="M22 7H2v5h20V7z" />
              <path d="M12 22V7" />
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
            </svg>
            <span className="mt-seats-label">Ghế</span>
            <div className="mt-seats-chips">
              {seats.map((s) => (
                <span key={s} className="mt-seat-chip">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Nút thanh toán — chỉ hiện khi PENDING ── */}
        {canPay && (
          <button
            className={`mt-pay-btn ${paying ? "mt-pay-btn-loading" : ""}`}
            onClick={() => onPay(booking._id)}
            disabled={paying}
          >
            {paying ? (
              <>
                <span className="mt-pay-spinner" />
                ĐANG XỬ LÝ...
              </>
            ) : (
              <>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
                THANH TOÁN
              </>
            )}
          </button>
        )}
      </div>

      {/* ── Right: price + barcode ── */}
      <div className="mt-ticket-right">
        <div className="mt-price">{formatCurrency(price)}</div>
        <div className="mt-booking-id">#{shortId}</div>
        <div className="mt-movie-id-label">#{booking.movieId}</div>
        <div className="mt-barcode" aria-hidden="true">
          {[14, 8, 18, 10, 16, 6, 20, 12, 14, 18, 8, 16, 10, 20, 6, 14].map(
            (h, i) => (
              <div key={i} className="mt-bar" style={{ height: `${h}px` }} />
            ),
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Main Page ───────────────────────────────────────────── */
type FilterKey = "ALL" | RawBooking["status"];

let toastId = 0;

const MyTickets: React.FC = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<EnrichedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<FilterKey>("ALL");
  const [payingIds, setPayingIds] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<Toast[]>([]);

  const user: { _id?: string; id?: string; userId?: number | string } | null =
    JSON.parse(localStorage.getItem("user") ?? "null");
  const userId = user?._id ?? user?.id ?? user?.userId;

  /* ── Toast helpers ── */
  const addToast = useCallback((toast: Omit<Toast, "id">, duration = 4000) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { ...toast, id }]);
    if (toast.type !== "loading") {
      setTimeout(() => removeToast(id), duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /* ── Fetch data ── */
  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BOOKING_API}/bookings`);
      if (!res.ok) throw new Error(`Booking service lỗi: ${res.status}`);
      const all: RawBooking[] = await res.json();

      // eslint-disable-next-line eqeqeq
      const mine = all.filter((b) => b.userId == userId);

      let movies: Movie[] = [];
      try {
        const mRes = await fetch(`${MOVIE_API}/movies`);
        if (mRes.ok) movies = await mRes.json();
      } catch {
        console.warn("Movie Service không khả dụng");
      }

      const enriched: EnrichedBooking[] = await Promise.all(
        mine.map(async (b) => {
          let movie = findMovie(movies, b.movieId);
          if (!movie) {
            try {
              const r = await fetch(`${MOVIE_API}/movies/${b.movieId}`);
              if (r.ok) movie = await r.json();
            } catch {
              /* bỏ qua */
            }
          }
          return {
            ...b,
            movieTitle: movie?.title ?? `Phim #${b.movieId}`,
            moviePoster: movie?.poster ?? undefined,
            movieGenre: movie?.genre ?? undefined,
          };
        }),
      );

      enriched.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setBookings(enriched);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Không thể tải danh sách vé.",
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!user || userId === undefined) {
      navigate("/login");
      return;
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Xử lý thanh toán ── */
  const handlePay = useCallback(
    async (bookingId: string) => {
      setPayingIds((prev) => new Set(prev).add(bookingId));

      // Toast loading
      const loadingId = addToast({
        type: "loading",
        title: "Đang xử lý thanh toán...",
        message: "Vui lòng chờ trong giây lát",
      });

      try {
        const res = await fetch(`${PAYMENT_API}/payments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId }),
        });

        const data = await res.json();
        removeToast(loadingId);

        if (data.status === "SUCCESS") {
          addToast(
            {
              type: "success",
              title: "🎬 Đặt vé thành công!",
              message: `Booking #${bookingId.slice(-6).toUpperCase()} đã được xác nhận.`,
            },
            5000,
          );
        } else {
          addToast(
            {
              type: "error",
              title: "Thanh toán thất bại",
              message: data.message ?? "Vui lòng thử lại sau.",
            },
            5000,
          );
        }

        // Reload lại danh sách để cập nhật status
        await loadData();
      } catch (err: unknown) {
        removeToast(loadingId);
        addToast({
          type: "error",
          title: "Lỗi kết nối",
          message:
            err instanceof Error
              ? err.message
              : "Không thể kết nối Payment Service.",
        });
      } finally {
        setPayingIds((prev) => {
          const next = new Set(prev);
          next.delete(bookingId);
          return next;
        });
      }
    },
    [addToast, removeToast, loadData],
  );

  /* ── Filter ── */
  const filtered =
    filter === "ALL" ? bookings : bookings.filter((b) => b.status === filter);

  const counts = {
    ALL: bookings.length,
    SUCCESS: bookings.filter((b) => b.status === "SUCCESS").length,
    PENDING: bookings.filter((b) => b.status === "PENDING").length,
    FAILED: bookings.filter((b) => b.status === "FAILED").length,
  };

  const tabs: Array<{ key: FilterKey; label: string }> = [
    { key: "ALL", label: `Tất cả (${counts.ALL})` },
    { key: "SUCCESS", label: `Thành công (${counts.SUCCESS})` },
    { key: "PENDING", label: `Chờ xác nhận (${counts.PENDING})` },
    { key: "FAILED", label: `Thất bại (${counts.FAILED})` },
  ];

  return (
    <div className="mt-wrapper">
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="mt-header">
        <p className="mt-eyebrow">Premium Cinema</p>
        <h1 className="mt-title">VÉ CỦA TÔI</h1>
        <div className="mt-title-line" />
      </div>

      {error && (
        <div className="mt-error">
          <svg
            width="15"
            height="15"
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

      {!loading && !error && bookings.length > 0 && (
        <div className="mt-tabs">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={`mt-tab ${filter === t.key ? "mt-tab-active" : ""}`}
              onClick={() => setFilter(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <div className="mt-list">
        {loading &&
          Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        {!loading && !error && filtered.length === 0 && (
          <Empty filtered={filter !== "ALL"} />
        )}
        {!loading &&
          !error &&
          filtered.map((b) => (
            <TicketCard
              key={b._id}
              booking={b}
              onPay={handlePay}
              paying={payingIds.has(b._id)}
            />
          ))}
      </div>
    </div>
  );
};

export default MyTickets;
