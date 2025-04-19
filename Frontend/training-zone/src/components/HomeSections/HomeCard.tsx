import React from "react";
import './HomeCard.css';

interface CardProps {
  icon: React.ReactNode;
  title: string;
  descriptionText: string;
  buttonText: string;
  scrollToId?: string;
}

const HomeCard: React.FC<CardProps> = ({ icon, title, descriptionText, buttonText, scrollToId}) => {
  const handleClick = () => {
    if (scrollToId) {
      const section = document.getElementById(scrollToId);
      section?.scrollIntoView({ behavior: 'smooth'});
    }
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