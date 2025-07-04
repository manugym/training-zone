import { useEffect, useState } from "react";
import "./AllTrainers.css";
import NavBar from "../../components/NavBar/NavBar";
import trainerService from "../../services/trainer.service";
import { AllTrainers } from "../../models/all-trainers";
import { TrainerFilter } from "../../models/trainer-filter";
import { ClassType } from "../../models/enums/class-type";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner/Spinner";
import { useTranslation } from "react-i18next";

function AllTrainersView() {
  const SERVER_IMAGE_URL = `${import.meta.env.VITE_SERVER_URL
    }/UserProfilePicture`;

  const navigate = useNavigate();

  const [allTrainers, setAllTrainers] = useState<AllTrainers | null>(null);

  const [classType, setClassType] = useState<ClassType | null>(null);
  const [name, setName] = useState<string>("");
  const [entitiesPerPage, setEntitiesPerPage] = useState<number>(5);
  const [actualPage, setActualPage] = useState<number>(1);
  const { t } = useTranslation("trainer");
  // Initial filter
  const [filter, setFilter] = useState<TrainerFilter>({
    ClassType: null,
    Name: "",
    entitiesPerPage: 5,
    actualPage: 1,
  });

  const [loading, setLoading] = useState(false);

  // Handle filter changes
  useEffect(() => {
    setFilter({
      ClassType: classType,
      Name: name,
      entitiesPerPage: entitiesPerPage,
      actualPage: actualPage,
    });
  }, [classType, entitiesPerPage, actualPage]);

  // Debounce the name input to avoid too many requests
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilter((prev) => ({
        ...prev,
        Name: name,
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
      } catch (error) {
        console.error("Error fetching trainers", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, [filter]);

  return (
    <>
      <NavBar />
      <main className="all-trainers-view-container">
        {!loading && (
          <div className="content-container">
            <div className="top-section">
              <h1>{t("title")}</h1>

              <div className="search-container">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("search_placeholder")}
                />

                <select
                  value={classType !== null ? classType : ""}
                  onChange={(e) =>
                    setClassType(
                      e.target.value === ""
                        ? null
                        : (Number(e.target.value) as ClassType)
                    )
                  }
                >
                  <option value="">{t("all_classes")}</option>
                  {Object.keys(ClassType)
                    .filter((key) => isNaN(Number(key)))
                    .map((key) => (
                      <option
                        key={key}
                        value={ClassType[key as keyof typeof ClassType]}
                      >
                        {key}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {allTrainers && allTrainers.Trainers.length > 0 && (
              <>
                <div className="all-trainers-container">
                  {allTrainers.Trainers.map((trainer) => (
                    <div key={trainer.User.Id} className="trainer-card">
                      <div className="trainer-image-container">
                        <img
                          src={`${SERVER_IMAGE_URL}/${trainer.User.AvatarImageUrl || "default.png"
                            }`}
                          alt="Trainer"
                          className="trainer-image"
                        />
                      </div>
                      <div className="trainer-information-container">
                        <div className="trainer-info-top">
                          <h2>{trainer.User.Name}</h2>

                          {trainer.TrainerClasses.map((c, i) => (
                            <p
                              key={c.Id}
                              className={
                                i % 2 == 0
                                  ? "trainer-specialty-pair"
                                  : "trainer-specialty-odd"
                              }
                            >
                              {ClassType[c.Type]}
                            </p>
                          ))}
                        </div>
                        <button
                          onClick={() =>
                            navigate(`/trainer/${trainer.User.Id}`)
                          }
                        >
                          {t("view_profile")}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pagination-container">
                  <div className="pagination">
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
                      className={
                        actualPage === allTrainers.TotalPages
                          ? "disabled"
                          : "enabled"
                      }
                      onClick={() => {
                        if (actualPage < allTrainers.TotalPages) {
                          setActualPage(actualPage + 1);
                        }
                      }}
                    >
                      &gt;
                    </span>
                    <span
                      className={
                        actualPage === allTrainers.TotalPages
                          ? "disabled"
                          : "enabled"
                      }
                      onClick={() => setActualPage(allTrainers.TotalPages)}
                    >
                      &raquo;
                    </span>
                  </div>

                  <div className="page-size-selector">
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
              </>
            )}
          </div>
        )}

        {!loading && (!allTrainers || allTrainers.Trainers.length === 0) && (
          <div className="no-trainers-message">
            <h2>{t("no_trainers")}</h2>
          </div>
        )}

        {loading && <Spinner />}
      </main>
    </>
  );
}

export default AllTrainersView;
