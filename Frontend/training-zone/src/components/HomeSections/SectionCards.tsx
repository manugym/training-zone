import React from "react";
import HomeCard from "./HomeCard";
import './SectionCards.css';
import { PiUsersFourFill } from "react-icons/pi";
import { MdOutlineSportsKabaddi } from "react-icons/md";
import { IoPhonePortraitOutline } from "react-icons/io5";

const SectionCards: React.FC = () => {
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
          navigateTo="/trainers"
          />
          <HomeCard
            icon={<PiUsersFourFill />}
            title="Entrenamiento en Grupo"
            descriptionText="El entrenamiento en grupo permite mejorar tu físico de una manera divertida"
            buttonText="Ver descripción"
            navigateTo="/classes"
            />
            <HomeCard
            icon={<IoPhonePortraitOutline />}
            title="Plan de entrenamiento"
            descriptionText="Consigue un plan de entrenamiento personalizado gracias a nuestra IA"
            buttonText="Conocer más"
            navigateTo="/trainers"
            />
        </div>
      </div>
    </section>
  );
};

export default SectionCards;