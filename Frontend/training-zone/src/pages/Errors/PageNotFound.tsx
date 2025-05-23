import { useNavigate } from "react-router-dom";
import errorImage from "../../assets/error-pages/error-404-image.png";
import "./Errors.css";

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <main className="page-not-found">
      <div className="content">
        <h1>404</h1>
        <h3>Page not found</h3>
        <p className="description">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <img src={errorImage} alt="Error 404" className="error-image" />
        <button onClick={() => navigate("/")} className="button">
          Go Home
        </button>
      </div>
    </main>
  );
}
