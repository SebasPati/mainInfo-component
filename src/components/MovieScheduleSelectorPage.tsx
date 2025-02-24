import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  fetchInfo,
  fetchMovies,
  fetchRooms,
  saveInfo,
  saveReservation,
} from "src/services/event.service";
import "../styles/seats.scss";
import Swal from "sweetalert2";
import Header from "./Header";
import Footer from "./Footer";

export interface Room {
  id: string;
  name: string;
  capacity: number;
}

const seatLayouts: { [key: number]: { rows: number; cols: number } } = {
  8: { rows: 2, cols: 4 },
  40: { rows: 5, cols: 8 },
  60: { rows: 6, cols: 10 },
  150: { rows: 10, cols: 15 },
};

const schedules = ["14:00", "16:30", "19:00", "21:15"];

export const MovieScheduleSelector: React.FC = () => {
  const [email, setEmail] = useState("");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const movieTitle = searchParams.get("movie") ?? "Sin título";
  const [rooms, setRooms] = useState<Room[]>([]);
  const [info, setInfo] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<string>(
    schedules[0]
  );
  const [occupiedSeats, setOccupiedSeats] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const navigate = useNavigate();
  const [movies, setMovies] = useState<any[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null);

  useEffect(() => {
    const loadMovies = async () => {
      const data = await fetchMovies();
      setMovies(data);
      const foundMovie = data.find((movie: { title: string; }) => movie.title === movieTitle);
      setSelectedMovie(foundMovie || null);
    };
    loadMovies();
  }, [movieTitle]);
  useEffect(() => {
    const loadRooms = async () => {
      const data: Room[] = await fetchRooms();
      setRooms(data);
      setSelectedRoom(data.length > 0 ? data[0] : null);
    };
    loadRooms();
  }, []);

  useEffect(() => {
    const loadInfo = async () => {
      const data = await fetchInfo();
      setInfo(data);
    };
    loadInfo();
  }, []);

  useEffect(() => {
    if (!info || !selectedRoom || !selectedSchedule) return;
    const movie = info.find((m) => m.movieName === movieTitle);
    const room = movie?.rooms.find(
      (r: { roomName: string }) => r.roomName === selectedRoom.name
    );
    const schedule = room?.schedules.find(
      (s: { time: string }) => s.time === selectedSchedule
    );
    setOccupiedSeats(schedule?.seats || []);
  }, [info, selectedRoom, selectedSchedule]);

  const handleSeatSelection = (seat: string) => {
    setSelectedSeats((prevSeats) =>
      prevSeats.includes(seat)
        ? prevSeats.filter((s) => s !== seat)
        : [...prevSeats, seat]
    );
  };

  const handleConfirm = async () => {
    if (!email) {
      alert("Por favor, ingresa tu correo electrónico.");
      return;
    }
    if (selectedSeats.length === 0) {
      alert("Por favor, selecciona al menos un asiento.");
      return;
    }
    const updatedInfo = [...(info || [])];

    const movieIndex = updatedInfo.findIndex(
      (movie) => movie.movieName === movieTitle
    );

    const newEntry = {
      movieName: movieTitle,
      rooms: [
        {
          roomName: selectedRoom?.name || "",
          schedules: [
            {
              time: selectedSchedule,
              seats: selectedSeats,
            },
          ],
        },
      ],
    };

    if (movieIndex !== -1) {
      const existingMovie = updatedInfo[movieIndex];

      const roomIndex = existingMovie.rooms.findIndex(
        (room: { roomName: string | undefined }) =>
          room.roomName === selectedRoom?.name
      );

      if (roomIndex !== -1) {
        const existingRoom = existingMovie.rooms[roomIndex];
        const scheduleIndex = existingRoom.schedules.findIndex(
          (schedule: { time: string }) => schedule.time === selectedSchedule
        );

        if (scheduleIndex !== -1) {
          existingRoom.schedules[scheduleIndex].seats = [
            // @ts-ignore
            ...new Set([
              ...existingRoom.schedules[scheduleIndex].seats,
              ...selectedSeats,
            ]),
          ];
        } else {
          existingRoom.schedules.push({
            time: selectedSchedule,
            seats: selectedSeats,
          });
        }
      } else {
        existingMovie.rooms.push({
          roomName: selectedRoom?.name || "",
          schedules: [{ time: selectedSchedule, seats: selectedSeats }],
        });
      }
    } else {
      updatedInfo.push(newEntry);
    }
    const today = new Date().toISOString().split("T")[0];
    const fullSchedule = `${today} ${selectedSchedule}`;

    const reservationData = {
      movie: movieTitle,
      room: selectedRoom?.name || "",
      schedule: fullSchedule,
      seats: selectedSeats,
      email: email,
    };
    console.log(reservationData);
    try {
      const response = await saveReservation(reservationData);
      if (response.error) {
        alert("No se pudo guardar la reserva");
      } else {
        Swal.fire({
          title: "Reserva Confirmada",
          text: `Se ha enviado la informacion a su correo electronico`,
          icon: "success",
          confirmButtonText: "Aceptar",
          background: "#d4edda",
          color: "#155724",
          confirmButtonColor: "#28a745",
        }).then(() => {
          navigate("/");
        });
      }
    } catch (error) {
      console.error("Error al guardar la reserva:", error);
      alert("Error al procesar la reserva");
    }
    setInfo(updatedInfo);
    saveInfo(updatedInfo);
  };

  const handleRoomChange = (roomName: string) => {
    const newRoom = rooms.find((room) => room.name === roomName) || null;
    setSelectedRoom(newRoom);
    setSelectedSeats([]);
  };

  const seatConfig = seatLayouts[selectedRoom?.capacity || 40];
  const rows = Array.from({ length: seatConfig.rows }, (_, i) =>
    String.fromCharCode(65 + i)
  );
  const columns = Array.from({ length: seatConfig.cols }, (_, i) => i + 1);

  return (
    <><Header></Header><div className="container mt-4">
      <h2 className="text-center">Selecciona una Sala, Horario y Asientos</h2>
      <div className="movie-container">
        {selectedMovie ? (
          <div className="movie-card">
            <div className="movie-info">
              <h1>{selectedMovie.title}</h1>
              <p><strong>Clasificación:</strong> {selectedMovie.classification}</p>
              <p><strong>Género:</strong> {selectedMovie.genre}</p>
              <p><strong>Duración:</strong> {selectedMovie.duration} min</p>
            </div>
          </div>
        ) : (
          <p>No se encontró información de la película.</p>
        )}
      </div>
      <button
        className="btn btn-secondary mt-3 w-100"
        onClick={() => navigate("/")}
      >
        Volver a la selección de películas
      </button>
      <div className="form-group mt-3">
        <label>Correo electrónico:</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ingresa tu correo"
          required
          pattern=".+@.+" />
      </div>
      <div className="form-group mt-3">
        <label>Selecciona una sala:</label>
        <select
          className="form-control"
          value={selectedRoom?.name || ""}
          onChange={(e) => handleRoomChange(e.target.value)}
        >
          {rooms.map((room) => (
            <option key={room.id} value={room.name}>
              {room.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group mt-3">
        <label>Selecciona un horario:</label>
        <select
          className="form-control"
          value={selectedSchedule}
          onChange={(e) => setSelectedSchedule(e.target.value)}
        >
          {schedules.map((schedule) => (
            <option key={schedule} value={schedule}>
              {schedule}
            </option>
          ))}
        </select>
      </div>

      <h3 className="text-center mt-4">Selecciona tus asientos</h3>
      <h1 className="text-center mt-4">PANTALLA</h1>
      <div className="seat-container">
        <div className="seat-grid">
          {rows.map((row) => (
            <div key={row} className="seat-row">
              {columns.map((col) => {
                const seatId = `${row}${col}`;
                const isSelected = selectedSeats.includes(seatId);
                const isOccupied = occupiedSeats.includes(seatId);

                return (
                  <label
                    key={seatId}
                    className={`seat ${isSelected ? "selected" : ""} ${isOccupied ? "occupied" : ""}`}
                  >
                    <input
                      type="checkbox"
                      value={seatId}
                      checked={isSelected}
                      onChange={() => handleSeatSelection(seatId)}
                      disabled={isOccupied} />
                    {seatId}
                  </label>
                );
              })}
            </div>
          ))}
        </div>
        <div className="legend">
          <h4>Convenciones</h4>
          <div className="legend-item">
            <span className="seat available"></span> Disponible
          </div>
          <div className="legend-item">
            <span className="seat selected"></span> Tu Selección
          </div>
          <div className="legend-item">
            <span className="seat occupied"></span> Ocupado
          </div>
        </div>
      </div>

      <button
        className="btn btn-primary mt-3 w-100"
        onClick={handleConfirm}
        disabled={!email.includes("@") || selectedSeats.length === 0}
      >
        Confirmar Selección
      </button>
    </div>
    <Footer></Footer></>
  );
};

export default MovieScheduleSelector;
