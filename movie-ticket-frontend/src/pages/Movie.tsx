import { movies } from "../mock/data";
import { useNavigate } from "react-router-dom";
import type { Movie } from "../types";

const Movies: React.FC = () => {
  const navigate = useNavigate();

  const handleBooking = (movieId: number) => {
    console.log("EVENT: USER_SELECT_MOVIE", movieId);

    navigate(`/booking/${movieId}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Danh sách phim</h2>

      {movies.map((movie: Movie) => (
        <div
          key={movie.id}
          style={{
            border: "1px solid #ccc",
            margin: 10,
            padding: 10,
            borderRadius: 8,
          }}
        >
          <h3>{movie.title}</h3>
          <p>{movie.description}</p>

          <button onClick={() => handleBooking(movie.id)}>
            🎟 Đặt vé
          </button>
        </div>
      ))}
    </div>
  );
};

export default Movies;