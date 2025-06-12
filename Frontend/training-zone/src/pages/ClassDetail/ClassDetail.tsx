import { useEffect, useState } from "react";
import "./ClassDetail.css";
import NavBar from "../../components/NavBar/NavBar";
import Calendar from "react-calendar";
import { ClassType } from "../../models/enums/class-type";
import classService from "../../services/class.service";
import reservationService from "../../services/reservation.service";
import Spinner from "../../components/Spinner/Spinner";
import { Schedule } from "../../models/schedule";
import { Reservation } from "../../models/reservation";
import { useParams } from "react-router-dom";
import { addDays, subDays, format } from "date-fns";
import { FaCalendarAlt } from "react-icons/fa";

function ActivitiesPage() {
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [classes, setClasses] = useState<Schedule[] | null>(null);
  const [reservationMap, setReservationMap] = useState<Map<number, number>>(new Map());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCalendarMinimized, setIsCalendarMinimized] = useState<boolean>(false);
  const { classId } = useParams<{ classId: string }>();
  const SERVER_IMAGE_URL = `${import.meta.env.VITE_SERVER_URL}/ClassPicture`;
  const imageName =
    classes && classes.length > 0 && ClassType[classes[0].ClassType]
      ? ClassType[classes[0].ClassType].toLowerCase()
      : "default";

  if (!classId || isNaN(Number(classId))) {
    return <h1>No se encontró la actividad buscada</h1>;
  }

  useEffect(() => {
    fetchData();
  }, [selectedDay, classId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const formattedDate = format(selectedDay, "yyyy-MM-dd");
      const clases = await classService.getClassesByDate(classId, formattedDate);
      setClasses(clases || []);
      const reservations = await reservationService.getReservationsByUser();
      const map = new Map<number, number>();
      reservations.forEach((r: Reservation) => map.set(r.ScheduleId, r.Id));
      setReservationMap(map);
    } catch (err) {
      console.error("Error fetching data:", err);
      setClasses([]);
      setError("Error al cargar datos. Por favor, inténtalo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const renderTime = (startDateTime: Date) =>
    startDateTime.toLocaleString([], { hour: "2-digit", minute: "2-digit", hour12: false });

  const handleDayChange = (date: Date) => {
    setSelectedDay(date);
    setIsCalendarMinimized(true);
  };
  const handlePreviousDay = () => setSelectedDay(subDays(selectedDay, 1));
  const handleNextDay = () => setSelectedDay(addDays(selectedDay, 1));

  const handleSignup = async (scheduleId: number) => {
    try {
      await reservationService.createReservation(scheduleId);
      await fetchData();
    } catch (err) {
      console.error("Error creating reservation:", err);
      alert("No se pudo apuntar. Inténtalo de nuevo.");
    }
  };

  const handleCancel = async (reservationId: number) => {
    try {
      await reservationService.deleteReservation(reservationId);
      await fetchData();
    } catch (err) {
      console.error("Error cancelling reservation:", err);
      alert("No se pudo cancelar. Inténtalo de nuevo.");
    }
  };

  return (
    <>
      <NavBar />
      <main className="activities-container">
        <div className="activities-grid">
          <div className="image-panel">
            <img src={`${SERVER_IMAGE_URL}/${imageName}.jpg`} alt={imageName} />
          </div>
          <div className="content-panel">
            <div className="calendar-panel">
              {isCalendarMinimized ? (
                <div className="calendar-navigation">
                  <button onClick={handlePreviousDay}>←</button>
                  <button
                    className="calendar-date"
                    onClick={() => setIsCalendarMinimized(false)}
                  >
                    <FaCalendarAlt className="calendar-icon" />
                    <span>{format(selectedDay, "yyyy-MM-dd")}</span>
                  </button>
                  <button onClick={handleNextDay}>→</button>
                </div>
              ) : (
                <Calendar
                  onChange={(date) => handleDayChange(date as Date)}
                  value={selectedDay}
                />
              )}
            </div>
            <div className="class-list-panel">
              {loading ? (
                <Spinner />
              ) : error ? (
                <p>{error}</p>
              ) : classes && classes.length > 0 ? (
                <table className="class-table">
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Descripción</th>
                      <th>Horario</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.map((c) => {
                      const reservationId = reservationMap.get(c.Id);
                      return (
                        <tr key={c.Id}>
                          <td>{ClassType[c.ClassType]}</td>
                          <td>{c.Description}</td>
                          <td>{renderTime(new Date(c.StartDateTime))}</td>
                          <td>
                            {reservationId ? (
                              <button
                                className="cancel-button"
                                onClick={() => handleCancel(reservationId)}
                              >
                                Cancelar
                              </button>
                            ) : (
                              <button
                                className="signup-button"
                                onClick={() => handleSignup(c.Id)}
                              >
                                Apuntarse
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p>No hay clases disponibles este día.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default ActivitiesPage;
