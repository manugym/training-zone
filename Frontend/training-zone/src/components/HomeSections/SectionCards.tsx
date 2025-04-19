import React from "react";
import HomeCard from "./HomeCard";
import './SectionCards.css';
import { PiUsersFourFill } from "react-icons/pi";
import { MdOutlineSportsKabaddi } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const SectionCards: React.FC = () => {
  const navigate = useNavigate();
  return(
    <section id="section-two" className="home-cards">
      <div className="offer-container">
        <h2 className="offer-title">¿Qué servicios ofrecemos?</h2>
        <p className="offer-description">
          Nos comprometemos a ofrecer el mejor servicio deportivo a nuestros clientes.<br/>
          Nuestros servicios van desde el entrenamiento personalizado a los entrenamientos
          grupales donde nuestros clientes pueden alcanzar sus objetivos de la forma que más
          se amolde a sus necesidades.
        </p>
        <div className="cards-grid">
          <HomeCard 
          icon={<MdOutlineSportsKabaddi />}
          title="Entrenamiento Personal"
          descriptionText="Logra tus objetivos de manera eficiente gracias a tu entrenador y clases personalizadas"
          buttonText="Conocer más"
          scrollToId="section-one"
          />
          <HomeCard
            icon={<PiUsersFourFill />}
            title="Entrenamiento en Grupo"
            descriptionText="El entrenamiento en grupo permite mejorar tu físico de una manera divertida"
            buttonText="Ver descripción"
            scrollToId="section-one"
            />
        </div>
      </div>
    </section>
  );
};

export default SectionCards;