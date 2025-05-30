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

function TrainerPage() {
  const SERVER_IMAGE_URL = `${
    import.meta.env.VITE_SERVER_URL
  }/UserProfilePicture`;

  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  if (!id) {
    return <h1>Trainer ID not found</h1>;
  }

  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);

  type ValuePiece = Date | null;
  type Value = ValuePiece | [ValuePiece, ValuePiece];

  const [selectedDay, setSelectedDay] = useState<Value | null>(null);

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
            <div className="trainer-details">
              {/*Trainer container */}
              <div className="trainer-info">
                <h1>{trainer.User.Name}</h1>
                <img
                  src={`${SERVER_IMAGE_URL}/${
                    trainer.User.AvatarImageUrl || "default.png"
                  }`}
                  alt="Trainer"
                  className="trainer-image"
                />

                <p>Especialidades</p>

                <div className="question-container">
                  <h2>¿Tienes alguna duda?</h2>

                  <button onClick={async () => await handleClick(trainer.User)}>
                    Enviar Mensaje
                  </button>
                </div>
              </div>

              {/* Schedule and trainer classes container*/}
              <div className="classes-container">
                <div className="schedule-container">
                  <Calendar onChange={setSelectedDay} value={selectedDay} />
                </div>

                <div className="class-container">
                  {selectedDay ? (
                    <h2>Clases del dia {selectedDay.toLocaleString()}</h2>
                  ) : (
                    <p>Selecciona un dia </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {!loading && !trainer && (
            <div className="trainer-not-found">
              <h2>Entrenador no encontrado</h2>
            </div>
          )}

          {loading && <Spinner />}
        </div>
      </main>
    </>
  );
}

export default TrainerPage;
