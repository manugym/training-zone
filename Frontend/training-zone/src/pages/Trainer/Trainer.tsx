import { useEffect, useState } from "react";
import "./Trainer.css";
import NavBar from "../../components/NavBar/NavBar";
import { useNavigate, useParams } from "react-router-dom";
import trainerService from "../../services/trainer.service";
import { Trainer } from "../../models/trainer";
import Spinner from "../../components/Spinner/Spinner";
import chatService from "../../services/chat.service";
import websocketService from "../../services/websocket.service";
import apiService from "../../services/api.service";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTrainer = async () => {
      setLoading(true);
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

  const handleClick = async () => {};

  return (
    <>
      <NavBar />
      <main className="trainer-container">
        <div className="trainer-panel">
          {!loading && trainer && (
            <div className="trainer-details">
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

                  <button onClick={handleClick}>Enviar Mensaje</button>
                </div>
              </div>

              <div className="schedule-container">
                <h1>Horarios</h1>
                <p>Implementar con las clases</p>
              </div>
            </div>
          )}

          {!loading && !trainer && (
            <div className="trainer-not-found">
              <h2>Entrenador no encontrado</h2>
            </div>
          )}

          {loading && (
            <div className="loading-container">
              <Spinner />
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default TrainerPage;
