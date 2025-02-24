import React, { useEffect, useState } from "react";
import { fetchReservations, deleteReservation, fetchInfo, saveInfo } from "src/services/event.service";
import "../styles/Reservations.scss";
import Footer from "./Footer";
import Header from "./Header";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export const Reservations: React.FC = () => {
    const [reservations, setReservations] = useState<any[]>([]);
    const [info, setInfo] = useState<any[]>([]);
    const [email, setEmail] = useState<string>("");
    const [filteredReservations, setFilteredReservations] = useState<any[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
        const loadReservations = async () => {
            const data = await fetchReservations();
            setReservations(data.reservations);
        };
        loadReservations();
    }, []);

    useEffect(() => {
        const loadInfo = async () => {
            const data = await fetchInfo();
            setInfo(data);
        };
        loadInfo();
    }, []);

    const handleSearch = () => {
        const filtered = reservations.filter(reservation => reservation.email === email.trim());
        setFilteredReservations(filtered);
    };

    const handleCancelReservation = async (id: string, movie: string, email: string, room: string, schedule: string, seats: string[]) => {

        const time = schedule.split(" ")[1];
        console.log(id, movie, room, time, seats);
        info.forEach(movieItem => {
            if (movieItem.movieName === movie) {
                movieItem.rooms.forEach((roomItem: { roomName: string; schedules: any[]; }) => {
                    if (roomItem.roomName === room) {
                        roomItem.schedules.forEach(scheduleItem => {
                            if (scheduleItem.time === time) {
                                scheduleItem.seats = scheduleItem.seats.filter((seat: string) => !seats.includes(seat));
                            }
                        });
                    }
                });
            }
        });
        try {
            await deleteReservation(id, movie, email);
            setFilteredReservations(prev => prev.filter(reservation => reservation.id !== id));
            setReservations(prev => prev.filter(reservation => reservation.id !== id));
        } catch (error) {
            console.error("Error al cancelar la reserva:", error);
        }
        saveInfo(info);
        Swal.fire({
            title: "Cancelacion Exitosa",
            text: `Se ha enviado la informacion a su correo electronico`,
            icon: "success",
            confirmButtonText: "Aceptar",
            background: "#d4edda",
            color: "#155724",
            confirmButtonColor: "#28a745",
          })
    };
    
    
    

    return (
        <>
            <Header />
            <div className="header-report-container">
            <button className="btn btn-outline-light reservation-button" onClick={() => navigate("/")}>
    Volver al inicio
  </button>
  </div>
            <div className="reservations-container">
                <h2>Buscar Reservas</h2>
                <div className="search-box">
                    <input
                        type="email"
                        placeholder="Ingrese su correo"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button onClick={handleSearch}>Buscar</button>
                </div>

                {filteredReservations.length > 0 ? (
                    <ul className="reservations-list">
                        {filteredReservations.map((reservation) => (
                            <li key={reservation.id} className="reservation-item">
                                <strong>Película:</strong> {reservation.movie} <br />
                                <strong>Horario:</strong> {reservation.schedule} <br />
                                <strong>Sala:</strong> {reservation.room} <br />
                                <strong>Asientos:</strong> {reservation.seats.join(", ")} <br />
                                <button 
                                    className="cancel-button" 
                                    onClick={() => handleCancelReservation(reservation.id, reservation.movie, reservation.email, reservation.room, reservation.schedule, reservation.seats)}
                                >
                                    Cancelar Reserva
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay reservas para este correo.</p>
                )}
            </div>
        </>
    );
};

export default Reservations;