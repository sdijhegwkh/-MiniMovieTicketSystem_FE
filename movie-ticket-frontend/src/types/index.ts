export interface Movie {
  _id: { $oid: string };
  movieId: string;
  title: string;
  genre: string;
  duration: number;
  releaseDate: { $date: string };
  director: string;
  cast: string[];
  description: string;
  status: "NOW_SHOWING" | "COMING_SOON" | "ENDED";
  createdAt: { $date: string };
  image?: string;    
  __v: number;
}

export interface Booking {
  id: number;
  movieId: string;
  seats: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
}