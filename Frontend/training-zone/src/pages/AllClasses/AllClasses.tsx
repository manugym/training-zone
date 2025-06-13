import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import classService from "../../services/class.service";
import NavBar from "../../components/NavBar/NavBar";
import Spinner from "../../components/Spinner/Spinner";
import { ClassType } from "../../models/enums/class-type";
import { Class } from "../../models/class";
import "./AllClasses.css";
import { useTranslation } from "react-i18next";

function AllClassesView() {
  const SERVER_IMAGE_URL = `${import.meta.env.VITE_SERVER_URL
    }/ClassPicture`;

  const navigate = useNavigate();

  const [classes, setClasses] = useState<Class[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("class");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const fetchedClasses = await classService.getAllClasses();
        setClasses(fetchedClasses);
      } catch (error) {
        console.error("Error fetching classes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  return (
    <>
      <NavBar />
      <main className="all-classes-view-container">
        {!loading && (
          <div className="content-container">
            <div className="top-section">
              <h1>{t("all_classes_title")}</h1>
            </div>
            {classes && classes.length > 0 && (
              <div className="all-classes-container">
                {classes.map((activity) => (
                  <div key={activity.Id} className="class-card">
                    <div className="class-image-container">
                      <img
                        src={`${SERVER_IMAGE_URL}/${activity.ClassImageUrl}`}
                        alt="Class"
                        className="class-image"
                      />
                    </div>
                    <div className="class-information-container">
                      <div className="class-info-top">
                        <h2>{ClassType[activity.Type]}</h2>
                        <p className="class-description-container">
                          {activity.Description}
                        </p>
                      </div>
                      <button onClick={() => navigate(`/class/${activity.Id}`)}>
                        {t("view_class")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!classes || classes.length === 0 && (
              <div className="no-classes-message">
                <h2>{t("no_classes_found")}</h2>
              </div>
            )}
          </div>
        )}
        {loading && <Spinner />}
      </main>
    </>
  );
}

export default AllClassesView;