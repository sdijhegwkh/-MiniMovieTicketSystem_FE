import { useNavigate } from "react-router-dom";
import "../styles/movie.css";
import type { Movie } from "../types";

const mockMovies: Movie[] = [
  {
    _id: { $oid: "69e8c627540900fff94764ca" },
    movieId: "M001",
    title: "Avengers: Endgame",
    genre: "Action",
    duration: 181,
    releaseDate: { $date: "2019-04-26T00:00:00.000Z" },
    director: "Anthony Russo",
    cast: ["Robert Downey Jr.", "Chris Evans"],
    description: "Final battle with Thanos",
    image: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg",   // URL poster thực từ API
    status: "NOW_SHOWING",
    createdAt: { $date: "2026-04-22T12:59:19.382Z" },
    __v: 0,
  },
  {
    _id: { $oid: "69e8c627540900fff94764cb" },
    movieId: "M002",
    title: "Spider-Man: No Way Home",
    genre: "Action",
    duration: 148,
    releaseDate: { $date: "2021-12-17T00:00:00.000Z" },
    director: "Jon Watts",
    cast: ["Tom Holland", "Zendaya"],
    description: "Multiverse chaos with Spider-Men",
    image: "https://i.ebayimg.com/images/g/Z8EAAOSwYSpi3vjf/s-l1200.jpg",
    status: "NOW_SHOWING",
    createdAt: { $date: "2026-04-22T13:00:00.000Z" },
    __v: 0,
  },
  {
    _id: { $oid: "69e8c627540900fff94764cc" },
    movieId: "M003",
    title: "The Batman",
    genre: "Crime",
    duration: 176,
    releaseDate: { $date: "2022-03-04T00:00:00.000Z" },
    director: "Matt Reeves",
    cast: ["Robert Pattinson", "Zoë Kravitz"],
    description: "Dark detective story of Gotham",
    image: "https://cdn.europosters.eu/image/1300/133030.jpg",
    status: "NOW_SHOWING",
    createdAt: { $date: "2026-04-22T13:01:00.000Z" },
    __v: 0,
  },
  {
    _id: { $oid: "69e8c627540900fff94764cd" },
    movieId: "M004",
    title: "Oppenheimer",
    genre: "Biography",
    duration: 180,
    releaseDate: { $date: "2023-07-21T00:00:00.000Z" },
    director: "Christopher Nolan",
    cast: ["Cillian Murphy", "Emily Blunt"],
    description: "Story of the atomic bomb creator",
    image: "https://m.media-amazon.com/images/I/91L+jiIFA3L.jpg",
    status: "COMING_SOON",
    createdAt: { $date: "2026-04-22T13:02:00.000Z" },
    __v: 0,
  },
  {
    _id: { $oid: "69e8c627540900fff94764ce" },
    movieId: "M005",
    title: "Interstellar",
    genre: "Sci-Fi",
    duration: 169,
    releaseDate: { $date: "2014-11-07T00:00:00.000Z" },
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway"],
    description: "Journey beyond the stars to save humanity",
    image: "https://m.media-amazon.com/images/I/91obuWzA3XL.jpg",
    status: "ENDED",
    createdAt: { $date: "2026-04-22T13:03:00.000Z" },
    __v: 0,
  },
  {
    _id: { $oid: "69e8c627540900fff94764cf" },
    movieId: "M006",
    title: "Dune: Part Two",
    genre: "Sci-Fi",
    duration: 166,
    releaseDate: { $date: "2024-03-01T00:00:00.000Z" },
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Zendaya"],
    description: "Paul Atreides rises to power",
    image: "https://m.media-amazon.com/images/M/MV5BNTc0YmQxMjEtODI5MC00NjFiLTlkMWUtOGQ5NjFmYWUyZGJhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    status: "COMING_SOON",
    createdAt: { $date: "2026-04-22T13:04:00.000Z" },
    __v: 0,
  }
];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });

const STATUS_MAP: Record<
  Movie["status"],
  { label: string; cls: string; dot: boolean }
> = {
  NOW_SHOWING: { label: "Đang chiếu", cls: "now-showing", dot: true },
  COMING_SOON: { label: "Sắp chiếu", cls: "coming-soon", dot: false },
  ENDED: { label: "Đã kết thúc", cls: "ended", dot: false },
};

const Movies: React.FC = () => {
  const navigate = useNavigate();

  const handleBooking = (movieId: string) => {
    console.log("EVENT: USER_SELECT_MOVIE", movieId);
    navigate(`/booking/${movieId}`);
  };

  return (
    <div className="movies-wrapper">
      <div className="movies-header">
        <p className="movies-eyebrow">Premium Cinema</p>
        <h1 className="movies-title">DANH SÁCH PHIM</h1>
        <div className="movies-line" />
      </div>

      {mockMovies.length === 0 ? (
        <p className="movies-empty">Không có phim nào hiện tại.</p>
      ) : (
        <div className="movies-grid">
          {mockMovies.map((movie) => {
            const status = STATUS_MAP[movie.status];
            const canBook = movie.status === "NOW_SHOWING";

            return (
              <div className="movie-card" key={movie.movieId}>
                <div className="corner corner-tl" />
                <div className="corner corner-br" />
                <div className="ticket-strip" />

                {/* ── Poster ── */}
                <div className="poster-wrap">
                  {movie.image ? (
                    <>
                      <img
                        className="poster-img"
                        src={movie.image}
                        alt={movie.title}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextElementSibling
                            ?.setAttribute("style", "display:flex");
                        }}
                      />
                      {/* fallback placeholder khi ảnh lỗi */}
                      <div className="poster-placeholder" style={{ display: "none" }}>
                        <div className="placeholder-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                               stroke="rgba(201,168,76,0.5)" strokeWidth="1.5">
                            <rect x="2" y="3" width="20" height="18" rx="1.5" />
                            <path d="M8 10l4 4 4-4" />
                          </svg>
                        </div>
                        <span className="placeholder-text">Không có ảnh</span>
                      </div>
                    </>
                  ) : (
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
                    <span className="meta-sep" />
                    <span className="meta-tag">{movie.director}</span>
                    <span className="meta-sep" />
                    <span className="meta-tag">
                      {formatDate(movie.releaseDate.$date)}
                    </span>
                  </div>
                  <p className="movie-desc">{movie.description}</p>
                  <div className="movie-cast">
                    <span className="cast-label">Diễn viên</span>
                    {movie.cast.join(", ")}
                  </div>
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