import React, { use, useEffect, useState } from "react";
import "./AllTrainers.css";
import NavBar from "../../components/NavBar/NavBar";
import trainerService from "../../services/trainer.service";
import { AllTrainers } from "../../models/all-trainers";
import { TrainerFilter } from "../../models/trainer-filter";
import { ClassType } from "../../models/enums/ClassType";

function AllTrainersView() {
  const SERVER_URL = `${import.meta.env.VITE_SERVER_URL}`;

  const [allTrainers, setAllTrainers] = useState<AllTrainers | null>(null);

  const [classType, setClassType] = useState<ClassType | null>(null);
  const [name, setName] = useState<string>("");
  const [entitiesPerPage, setEntitiesPerPage] = useState<number>(5);
  const [actualPage, setActualPage] = useState<number>(1);

  // Initial filter
  const [filter, setFilter] = useState<TrainerFilter>({
    classType: null,
    name: "",
    entitiesPerPage: 5,
    actualPage: 1,
  });

  const [loading, setLoading] = useState(false);

  // Handle filter changes
  useEffect(() => {
    setFilter({
      classType: classType,
      name: name,
      entitiesPerPage: entitiesPerPage,
      actualPage: actualPage,
    });
  }, [classType, entitiesPerPage, actualPage]);

  // Debounce the name input to avoid too many requests
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilter((prev) => ({
        ...prev,
        name: name,
        actualPage: 1,
      }));
    }, 400);

    return () => clearTimeout(timer);
  }, [name]);

  // Fetch trainers when the filter changes
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
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Buscar entrenador..."
        />

        {allTrainers && allTrainers.trainers.length > 0 ? (
          <div className="all-trainers-container">
            {allTrainers.trainers.map((trainer) => (
              <div key={trainer.user.id} className="trainer-card">
                <h3>{trainer.user.name}</h3>
              </div>
            ))}

            <div className="pagination-container">
              <div id="pagination">
                <span
                  className={actualPage === 1 ? "disabled" : "enabled"}
                  onClick={() => setActualPage(1)}
                >
                  &laquo;
                </span>
                <span
                  className={actualPage === 1 ? "disabled" : "enabled"}
                  onClick={() => {
                    if (actualPage > 1) {
                      setActualPage(actualPage - 1);
                    }
                  }}
                >
                  &lt;
                </span>
                <span>{actualPage}</span>
                <span
                  className={actualPage === 1 ? "disabled" : "enabled"}
                  onClick={() => {
                    if (actualPage < allTrainers.totalPages) {
                      setActualPage(actualPage + 1);
                    }
                  }}
                >
                  &gt;
                </span>
                <span
                  className={actualPage === 1 ? "disabled" : "enabled"}
                  onClick={() => setActualPage(allTrainers.totalPages)}
                >
                  &raquo;
                </span>
              </div>

              <div className="page-size-selector">
                <label htmlFor="page-size">Entrenadores por página:</label>
                <select
                  id="page-size"
                  value={entitiesPerPage}
                  onChange={(e) => {
                    setEntitiesPerPage(Number(e.target.value));
                    setActualPage(1);
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-trainers-message">No trainers available</div>
        )}
      </main>
    </>
  );
}

export default AllTrainersView;
