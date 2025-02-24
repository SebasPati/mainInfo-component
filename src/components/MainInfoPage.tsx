import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchInfo, fetchMovies, fetchRooms, saveInfo } from "src/services/event.service";
import "../styles/MainInfoPage.scss";
import { Room } from "./MovieScheduleSelectorPage";
import Header from "./Header";
import Footer from "./Footer";

interface Movie {
  id: string;
  classification: string;
  poster: string;
  duration: number;
  genre: string;
  title: string;
  desc: string;
}

interface Schedule {
  time: string;
  seats: string[];
}

interface RoomSchedule {
  roomName: string;
  schedules: Schedule[];
}

export const MainInfoPage = ({ properties }: any) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("Todos");
  const navigate = useNavigate();

  useEffect(() => {
    const loadMovies = async () => {
      const data = await fetchMovies();
      setMovies(data);
      setFilteredMovies(data);
      const allGenres = new Set(
        data.flatMap((movie: { genre: string; }) => movie.genre.split(", ").map((g) => g.trim()))
      );
      // @ts-ignore
      setGenres(["Todos", ...Array.from(allGenres)]);
    };
    loadMovies();
  }, []);

  useEffect(() => {
    const loadRooms = async () => {
      const data: Room[] = await fetchRooms();
      setRooms(data);
    };
    loadRooms();
  }, []);

  const handleSelectRoom = (title: string) => {
    navigate(`/select-room?movie=${encodeURIComponent(title)}`);
  };

  const handleFilterChange = (genre: string) => {
    setSelectedGenre(genre);
    if (genre === "Todos") {
      setFilteredMovies(movies);
    } else {
      setFilteredMovies(
        movies.filter((movie) => movie.genre.split(", ").includes(genre))
      );
    }
  };

  return (
    <><Header></Header>
    <div className="header-report-container">
  <button className="btn btn-outline-light report-button" onClick={() => navigate("/report")}>
    Ver Reporte
  </button>
  <button className="btn btn-outline-light reservation-button" onClick={() => navigate("/reservations")}>
    Ver mis reservas
  </button>
</div>
    <div className="container mt-4">
      <h1 className="text-center mb-4">Películas</h1>
      <div className="mb-3 text-center">
        <label className="me-2">Filtrar por género:</label>
        <select
          value={selectedGenre}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="form-select d-inline w-auto"
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>
      <div className="row">
        {filteredMovies.map((movie) => (
          <div className="col-md-4" key={movie.id}>
            <div className="movie-card">
              <div className="card-inner">
                <div className="card-front">
                  <img src={movie.poster} alt={movie.title} />
                </div>
                <div className="card-back">
                  <h5>{movie.title}</h5>
                  <p>{movie.desc}</p>
                  <p><strong>Género:</strong> {movie.genre}</p>
                  <p><strong>Duración:</strong> {movie.duration} min</p>
                  <p><strong>Clasificación:</strong> {movie.classification}</p>
                  <button
                    className="btn btn-primary mt-2"
                    onClick={() => handleSelectRoom(movie.title)}
                  >
                    Seleccionar Sala
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};