import { useNavigate } from "react-router-dom";
import errorImage from "../../assets/error-pages/forbidden-image.png";
import "./Errors.css";

export default function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <main className="page-not-found">
      <div className="content">
        <h1>401</h1>
        <h3>Access Denied</h3>
        <p className="description">
          You don’t have permission to view this page. It might have been moved
          or restricted.
        </p>
        <img src={errorImage} alt="Error 404" className="error-image" />
        <button onClick={() => navigate("/")} className="button">
          Go Home
        </button>
      </div>
    </main>
  );
}
