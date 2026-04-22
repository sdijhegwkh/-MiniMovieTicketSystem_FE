export interface Movie {
  id: number;
  title: string;
  description: string;
}

export interface Booking {
  id: number;
  movieId: number;
  seats: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
}