import React from "react";
import './HomeCard.css';

interface CardProps{
  icon: React.ReactNode;
  title: string;
  descriptionText: string;
  buttonText: string;
  onClick: () => void;
}

const HomeCard: React.FC<CardProps> = ({icon, title, descriptionText, buttonText, onClick}) => {
  return(
    <div className="home-card">
      <div className="card-icon">{icon}</div>
      <h2 className="card-title">{title}</h2>
      <p className="card-text">{descriptionText}</p>
      <button className="card-button" onClick={onClick}>
        {buttonText}
      </button>
    </div>
  );
};

export default HomeCard;