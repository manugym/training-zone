import React from "react";
import './HomeCard.css';
import { useNavigate } from "react-router-dom";

interface CardProps {
  icon: React.ReactNode;
  title: string;
  descriptionText: string;
  buttonText: string;
  navigateTo?: string;
}

const HomeCard: React.FC<CardProps> = ({
  icon,
  title,
  descriptionText,
  buttonText,
  navigateTo
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(navigateTo);
  };

  return (
    <div className="home-card">
      <div className="card-icon">{icon}</div>
      <h2 className="card-title">{title}</h2>
      <p className="card-text">{descriptionText}</p>
      <button className="card-button" onClick={handleClick}>
        {buttonText}
      </button>
    </div>
  );
};

export default HomeCard;