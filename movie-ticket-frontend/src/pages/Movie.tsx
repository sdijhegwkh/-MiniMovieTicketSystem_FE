import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/movie.css";

const API_BASE = "http://192.168.1.6:8082";

/* ─── Types ───────────────────────────────────────────────── */
interface Movie {
  _id: string;
  movieId: string;
  title: string;
  genre: string;
  duration: number;
  releaseDate: string;
  director?: string;
  cast: string[];
  description?: string;
  poster?: string;   // tên field thực từ backend
  status: "NOW_SHOWING" | "COMING_SOON";
  createdAt: string;
}

/* ─── Helpers ─────────────────────────────────────────────── */
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });

const STATUS_MAP: Record<
  Movie["status"],
  { label: string; cls: string; dot: boolean }
> = {
  NOW_SHOWING: { label: "Đang chiếu", cls: "now-showing", dot: true },
  COMING_SOON: { label: "Sắp chiếu",  cls: "coming-soon", dot: false },
};

/* ─── Poster placeholder ──────────────────────────────────── */
const PosterPlaceholder: React.FC = () => (
  <div className="poster-placeholder">
    <div className="placeholder-icon">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
           stroke="rgba(201,168,76,0.5)" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="18" rx="1.5" />
        <path d="M8 10l4 4 4-4" />
      </svg>
    </div>
    <span className="placeholder-text">Không có ảnh</span>
  </div>
);

/* ─── Loading skeleton ────────────────────────────────────── */
const SkeletonCard: React.FC = () => (
  <div className="movie-card skeleton-card">
    <div className="poster-wrap skeleton-poster" />
    <div className="card-body">
      <div className="skeleton-line w70" />
      <div className="skeleton-line w50" />
      <div className="skeleton-line w90" />
      <div className="skeleton-line w60" />
    </div>
  </div>
);

/* ─── Movies page ─────────────────────────────────────────── */
const Movies: React.FC = () => {
  const navigate = useNavigate();

  const [movies,  setMovies]  = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error,   setError]   = useState<string>("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(`${API_BASE}/movies`);
        if (!res.ok) throw new Error(`Server trả về ${res.status}`);
        const data: Movie[] = await res.json();
        setMovies(data);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Không thể tải danh sách phim."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleBooking = (movieId: string) => {
    navigate(`/booking/${movieId}`);
  };

  return (
    <div className="movies-wrapper">
      <div className="movies-header">
        <p className="movies-eyebrow">Premium Cinema</p>
        <h1 className="movies-title">DANH SÁCH PHIM</h1>
        <div className="movies-line" />
      </div>

      {/* ── Error state ── */}
      {error && (
        <div className="movies-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8"  x2="12"    y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      {/* ── Loading skeletons ── */}
      {loading && (
        <div className="movies-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && !error && movies.length === 0 && (
        <p className="movies-empty">Không có phim nào hiện tại.</p>
      )}

      {/* ── Movie grid ── */}
      {!loading && !error && movies.length > 0 && (
        <div className="movies-grid">
          {movies.map((movie) => {
            const status  = STATUS_MAP[movie.status] ?? STATUS_MAP["COMING_SOON"];
            const canBook = movie.status === "NOW_SHOWING";

            return (
              <div className="movie-card" key={movie.movieId}>
                <div className="corner corner-tl" />
                <div className="corner corner-br" />
                <div className="ticket-strip" />

                {/* ── Poster ── */}
                <div className="poster-wrap">
                  {movie.poster ? (
                    <>
                      <img
                        className="poster-img"
                        src={movie.poster}
                        alt={movie.title}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const sibling = e.currentTarget.nextElementSibling as HTMLElement | null;
                          if (sibling) sibling.style.display = "flex";
                        }}
                      />
                      <div style={{ display: "none" }}>
                        <PosterPlaceholder />
                      </div>
                    </>
                  ) : (
                    <PosterPlaceholder />
                  )}
                  <div className="poster-overlay" />
                  <div className={`badge-on-poster ${status.cls}`}>
                    {status.dot && <span className="badge-dot" />}
                    {status.label}
                  </div>
                </div>

                {/* ── Body ── */}
                <div className="card-body">
                  <div className="movie-title">{movie.title}</div>
                  <div className="movie-meta">
                    <span className="meta-tag">{movie.genre}</span>
                    {movie.director && (
                      <>
                        <span className="meta-sep" />
                        <span className="meta-tag">{movie.director}</span>
                      </>
                    )}
                    <span className="meta-sep" />
                    <span className="meta-tag">{formatDate(movie.releaseDate)}</span>
                  </div>
                  {movie.description && (
                    <p className="movie-desc">{movie.description}</p>
                  )}
                  {movie.cast.length > 0 && (
                    <div className="movie-cast">
                      <span className="cast-label">Diễn viên</span>
                      {movie.cast.join(", ")}
                    </div>
                  )}
                  <div className="movie-card-footer">
                    <span className="movie-duration">{movie.duration} phút</span>
                    <button
                      className="book-btn"
                      onClick={() => canBook && handleBooking(movie.movieId)}
                      disabled={!canBook}
                    >
                      {canBook ? "ĐẶT VÉ" : status.label.toUpperCase()}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Movies;
