import { useEffect, useState } from "react";
import "./Trainer.css";
import NavBar from "../../components/NavBar/NavBar";
import { useNavigate, useParams } from "react-router-dom";
import trainerService from "../../services/trainer.service";
import { Trainer } from "../../models/trainer";
import Spinner from "../../components/Spinner/Spinner";
import chatService from "../../services/chat.service";
import { User } from "../../models/user";
import Calendar from "react-calendar";
import apiService from "../../services/api.service";
import Swal from "sweetalert2";
import websocketService from "../../services/websocket.service";
import { Class } from "../../models/class";
import { ClassType } from "../../models/enums/class-type";
import { useTranslation } from "react-i18next";

function TrainerPage() {
  const SERVER_IMAGE_URL = `${import.meta.env.VITE_SERVER_URL
    }/UserProfilePicture`;

  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  if (!id) {
    return <h1>El ID del entrenador no se encontró</h1>;
  }

  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation("trainer");
  type ValuePiece = Date | null;
  type Value = ValuePiece | [ValuePiece, ValuePiece];

  const [selectedDay, setSelectedDay] = useState<Value | null>(null);
  const [classesOfSelectedDay, setClassesOfSelectedDay] = useState<
    Class[] | null
  >(null);

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const response = await trainerService.getTrainerById(Number(id));
        console.log("Trainer response:", response);
        if (!response) {
          throw new Error("Trainer not found");
        }

        setTrainer(response);
      } catch (error) {
        console.error("Error fetching trainer:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainer();
  }, [id]);

  useEffect(() => {
    if (!trainer || !selectedDay) return;

    const selectedDate = selectedDay as Date;
    const matchingClasses = trainer.TrainerClasses.filter((classItem) =>
      classItem.Schedules.some((schedule) => {
        const scheduleDate = new Date(schedule.StartDateTime);
        return (
          scheduleDate.getFullYear() === selectedDate.getFullYear() &&
          scheduleDate.getMonth() === selectedDate.getMonth() &&
          scheduleDate.getDate() === selectedDate.getDate()
        );
      })
    );

    setClassesOfSelectedDay(matchingClasses);
  }, [selectedDay, trainer]);

  const handleClick = async (user: User) => {
    if (!apiService.jwt) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: "Necesitas iniciar sesión",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      navigate("/auth", { state: { from: location.pathname } });
    }

    if (!websocketService.isConnected()) {
      await websocketService.connect();
      await chatService.sendGetAllChatsRequest();
    }

    // Wait for the chat service to load all chats before creating a new conversation
    const subscription = chatService.allChats$.subscribe((chats) => {
      if (chats) {
        chatService.newConversation(user);
        navigate("/chat");
        subscription.unsubscribe();
      }
    });
  };

  return (
    <>
      <NavBar />
      <main className="trainer-container">
        <div className="trainer-panel">
          {!loading && trainer && (
            <>
              <div className="trainer-details">
                {/*Trainer container */}
                <div className="trainer-info">
                  <h1>{trainer.User.Name}</h1>
                  <img
                    src={`${SERVER_IMAGE_URL}/${trainer.User.AvatarImageUrl || "default.png"
                      }`}
                    alt="Trainer"
                    className="trainer-image"
                  />

                  <div className="question-container">
                    <h2>{t("have_questions")}</h2>

                    <button
                      onClick={async () => await handleClick(trainer.User)}
                    >
                      {t("send_message")}
                    </button>
                  </div>
                </div>

                {/* Schedule and trainer classes container*/}
                <div className="classes-container">
                  <div className="schedule-container">
                    <Calendar
                      onChange={setSelectedDay}
                      value={selectedDay}
                      tileClassName={({ date, view }) => {
                        const trainerClasses = trainer?.TrainerClasses || [];

                        if (view === "month") {
                          const dayHasClass = trainerClasses.some((c) =>
                            c.Schedules.some((s) => {
                              const classDate = new Date(s.StartDateTime);
                              return (
                                classDate.getFullYear() === date.getFullYear() &&
                                classDate.getMonth() === date.getMonth() &&
                                classDate.getDate() === date.getDate()
                              );
                            })
                          );

                          return dayHasClass ? "class-day" : null;
                        }

                        return null;
                      }}
                    />
                  </div>

                  <div className="class-container">
                    {selectedDay ? (
                      classesOfSelectedDay &&
                        classesOfSelectedDay.length > 0 ? (
                        <table className="class-table">
                          <thead>
                            <tr>
                              <th>{t("class_type")}</th>
                              <th>{t("class_description")}</th>
                              <th>{t("class_actions")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {classesOfSelectedDay.map((c) => (
                              <tr key={c.Id}>
                                <td>{ClassType[c.Type]}</td>
                                <td>{c.Description}</td>
                                <td>
                                  <button
                                    onClick={() => navigate(`/class/${c.Id}`)}
                                  >
                                    {t("view_schedule")}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p>{t("no_classes")}</p>
                      )
                    ) : (
                      <p>{t("select_day")}</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {!loading && !trainer && (
            <div className="trainer-not-found">
              <h2>{t("not_found")}</h2>
            </div>
          )}

          {loading && <Spinner />}
        </div>
      </main>
    </>
  );
}

export default TrainerPage;
