import { useEffect, useState } from "react";
import "./ClassDetail.css";
import NavBar from "../../components/NavBar/NavBar";
import Calendar from "react-calendar";
import { ClassType } from "../../models/enums/class-type";
import classService from "../../services/class.service";
import Spinner from "../../components/Spinner/Spinner";
import { Schedule } from "../../models/schedule";
import { useParams } from "react-router-dom";
import { addDays, subDays, format } from "date-fns";
import { FaCalendarAlt } from "react-icons/fa";

function ActivitiesPage() {
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [classes, setClasses] = useState<Schedule[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCalendarMinimized, setIsCalendarMinimized] = useState<boolean>(false);
  const { classId } = useParams<{ classId: string }>();

  const SERVER_IMAGE_URL = `${import.meta.env.VITE_SERVER_URL
    }/ClassPicture`;

  const imageName =
    classes && classes.length > 0 && ClassType[classes[0].ClassType]
      ? ClassType[classes[0].ClassType].toLowerCase()
      : "default";

  if (!classId || isNaN(Number(classId))) {
    return <h1>No se encontró la actividad buscada</h1>;
  }

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        setError(null);
        const formattedDate = format(selectedDay, 'yyyy-MM-dd');
        const response = await classService.getClassesByDate(classId, formattedDate);
        setClasses(response || []);
      } catch (error) {
        console.error("Error fetching classes:", error);
        setClasses([]);
        setError("Error al cargar las clases. Por favor, inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [selectedDay, classId]);

  const renderTime = (startDateTime: Date) => {
    return startDateTime.toLocaleString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const handleDayChange = (date: Date) => {
    setSelectedDay(date);
    setIsCalendarMinimized(true);
  };

  const handlePreviousDay = () => {
    setSelectedDay(subDays(selectedDay, 1));
  };

  const handleNextDay = () => {
    setSelectedDay(addDays(selectedDay, 1));
  };

  const handleSignup = (scheduleId: number) => {
    alert(`Te has apuntado a la clase: ${scheduleId}`);
  };

  return (
    <>
      <NavBar />
      <main className="activities-container">
        <div className="activities-grid">
          <div className="image-panel">
            <img
              src={`${SERVER_IMAGE_URL}/${imageName}.jpg`}
              alt={imageName}
              title={imageName}
            />
          </div>
          <div className="content-panel">
            <div className="calendar-panel">
              {isCalendarMinimized ? (
                <div className="calendar-navigation">
                  <button onClick={handlePreviousDay}>←</button>

                  <button className="calendar-date" onClick={() => setIsCalendarMinimized(false)}>
                    <FaCalendarAlt className="calendar-icon" />
                    <span>{format(selectedDay, 'yyyy-MM-dd')}</span>
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
                    {classes.map((c) => (
                      <tr key={c.Id}>
                        <td>{ClassType[c.ClassType]}</td>
                        <td>{c.Description}</td>
                        <td>{renderTime(new Date(c.StartDateTime))}</td>
                        <td>
                          <button
                            className="signup-button"
                            onClick={() => handleSignup(c.Id)}
                          >
                            Apuntarse
                          </button>
                        </td>
                      </tr>
                    ))}
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
