import React, { useEffect, useState } from "react";
import "./Trainer.css";
import NavBar from "../../components/NavBar/NavBar";
import { useParams } from "react-router-dom";
import trainerService from "../../services/trainer.service";
import { Trainer } from "../../models/trainer";
import Spinner from "../../components/Spinner/Spinner";

function TrainerPage() {
  const SERVER_IMAGE_URL = `${
    import.meta.env.VITE_SERVER_URL
  }/UserProfilePicture`;

  const { id } = useParams<{ id: string }>();

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

  return (
    <>
      <NavBar />
      <main>
        <div className="trainer-container">
          {!loading && trainer && (
            <div className="trainer-details">
              <h1>{trainer.user.name}</h1>
              <img
                src={`${SERVER_IMAGE_URL}/${
                  trainer.user.avatarImageUrl || "default.png"
                }`}
                alt="Trainer"
                className="trainer-image"
              />
            </div>
          )}

          {!trainer && (
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
