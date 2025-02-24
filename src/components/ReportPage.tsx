import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { fetchInfo, fetchReservations, fetchRooms } from "src/services/event.service";
import "../styles/ReportPage.scss";
import Footer from "./Footer";
import Header from "./Header";

interface Room {
  id: string;
  name: string;
  capacity: number;
}

export const ReportPage: React.FC = () => {
  const [info, setInfo] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<string>("");
  const [showReservations, setShowReservations] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadInfo = async () => {
      const data = await fetchInfo();
      setInfo(data);
    };
    loadInfo();
  }, []);

  useEffect(() => {
    const loadReservations = async () => {
      const data = await fetchReservations();
      setReservations(data.reservations);
    };
    loadReservations();
  }, []);

  useEffect(() => {
    const loadRooms = async () => {
      const data: Room[] = await fetchRooms();
      setRooms(data);
    };
    loadRooms();
  }, []);

  const processData = () => {
    return info.map((movie) => {
      const totalSeats = movie.rooms.reduce(
        (sum: any, room: { schedules: any[] }) =>
          sum + room.schedules.reduce((s, sc) => s + sc.seats.length, 0),
        0
      );
      return { name: movie.movieName, seats: totalSeats };
    });
  };

  const processRoomData = () => {
    if (!selectedMovie) return [];

    const selectedMovieData = info.find(
      (movie) => movie.movieName === selectedMovie
    );
    if (!selectedMovieData) return [];

    return rooms.map((room) => {
      const occupiedSeats = selectedMovieData.rooms.reduce(
        (sum: any, roomData: { roomName: string; schedules: any[] }) => {
          if (
            roomData.roomName?.toLowerCase().trim() !==
            room.name.toLowerCase().trim()
          ) {
            return sum;
          }

          const seatsInRoom = roomData.schedules.reduce(
            (s: number, schedule: any) => s + (schedule.seats?.length || 0),
            0
          );

          return sum + seatsInRoom;
        },
        0
      );

      return {
        name: room.name,
        capacity: room.capacity,
        occupied: occupiedSeats,
      };
    });
  };

  const barChartData = processData();
  const pieChartData = processData();
  const roomChartData = processRoomData();

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#ffbb28"];

  return (
    <><Header></Header><div className="report-page">
        <div className="header-report-container">
            <button className="btn btn-outline-light reservation-button" onClick={() => navigate("/")}>
    Volver al inicio
  </button>
  </div>
          <h1 className="title">Reporte de Reservas</h1>

          <div className="charts-container">
              <div className="chart">
                  <h2>Porcentaje de Ocupación</h2>
                  <BarChart width={400} height={300} data={barChartData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="seats" fill="#8884d8" />
                  </BarChart>
              </div>
              <div className="chart">
                  <h2>Distribución de Reservas</h2>
                  <PieChart width={400} height={300}>
                      <Pie
                          data={pieChartData}
                          dataKey="seats"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label
                      >
                          {pieChartData.map((_, index) => (
                              <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]} />
                          ))}
                      </Pie>
                      <Legend />
                  </PieChart>
              </div>
          </div>
          <div className="movie-selector">
              <h2>Escoge una película para mostrar la gráfica de Comparación de Capacidad vs. Ocupación en Salas:</h2>
              <select
                  id="movie"
                  value={selectedMovie}
                  onChange={(e) => setSelectedMovie(e.target.value)}
              >
                  <option value="">-- Seleccionar --</option>
                  {info.map((movie) => (
                      <option key={movie.movieName} value={movie.movieName}>
                          {movie.movieName}
                      </option>
                  ))}
              </select>
          </div>
          {selectedMovie && (
              <div className="room-chart">
                  <h2>Capacidad vs. Ocupación por Sala ({selectedMovie})</h2>
                  <BarChart width={600} height={350} data={roomChartData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="capacity" fill="#82ca9d" name="Capacidad Total" />
                      <Bar dataKey="occupied" fill="#ff7f50" name="Asientos Ocupados" />
                  </BarChart>
              </div>
          )}
          <button className="back-button" onClick={() => setShowReservations(!showReservations)}>
              {showReservations ? "Ocultar Reservas" : "Mostrar Reservas"}
          </button>
          {showReservations && (
              <table className="reservations-table">
                  <thead>
                      <tr>
                          <th>Película</th>
                          <th>Sala</th>
                          <th>Horario</th>
                          <th>Asientos</th>
                          <th>Email</th>
                      </tr>
                  </thead>
                  <tbody>
                      {reservations.map((res) => (
                          <tr key={res.id}>
                              <td>{res.movie}</td>
                              <td>{res.room}</td>
                              <td>{res.schedule}</td>
                              <td>{res.seats.join(", ")}</td>
                              <td>{res.email}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          )}
      </div>
      <Footer></Footer></>
  );
};

export default ReportPage;