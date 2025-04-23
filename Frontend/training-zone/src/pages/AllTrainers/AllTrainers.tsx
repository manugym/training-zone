import React, { use, useEffect, useState } from "react";
import "./AllTrainers.css";
import NavBar from "../../components/NavBar/NavBar";
import trainerService from "../../services/trainer.service";
import { AllTrainers } from "../../models/all-trainers";
import { TrainerFilter } from "../../models/trainer-filter";

function AllTrainersView() {
  const [allTrainers, setAllTrainers] = useState<AllTrainers | null>(null);

  // Initial filter
  const [filter, setFilter] = useState<TrainerFilter>({
    classType: 0,
    name: "",
    entitiesPerPage: 5,
    actualPage: 1,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setLoading(true);

        const allTrainers = await trainerService.getAllTrainers(filter);
        console.log("Trainers", allTrainers);
        setAllTrainers(allTrainers);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching trainers", error);
      }
    };

    fetchTrainers();
  }, [filter]);

  return (
    <>
      <NavBar />
      <main>
        {allTrainers && allTrainers.trainers.length > 0 ? (
          <div className="all-trainers-container">
            {allTrainers.trainers.map((trainer) => (
              <div key={trainer.user.id} className="trainer-card">
                <h3>{trainer.user.name}</h3>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-trainers-message">No trainers available</div>
        )}
      </main>
    </>
  );
}

export default AllTrainersView;
