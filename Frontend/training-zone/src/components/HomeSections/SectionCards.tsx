import React from "react";
import HomeCard from "./HomeCard";
import './SectionCards.css';
import { PiUsersFourFill } from "react-icons/pi";
import { MdOutlineSportsKabaddi } from "react-icons/md";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

const SectionCards: React.FC = () => {
  const { t } = useTranslation("home");
  return (
    <section id="section-two" className="home-cards">
      <div className="offer-container">
        <h2 className="offer-title">{t("section_title")}</h2>
        <p className="offer-description">
          {t("section_description").split("\n").map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </p>
        <div className="cards-grid">
          <HomeCard 
            icon={<MdOutlineSportsKabaddi />}
            title={t("card_1_title")}
            descriptionText={t("card_1_description")}
            buttonText={t("card_1_button")}
            navigateTo="/trainers"
          />
          <HomeCard
            icon={<PiUsersFourFill />}
            title={t("card_2_title")}
            descriptionText={t("card_2_description")}
            buttonText={t("card_2_button")}
            navigateTo="/classes"
          />
          <HomeCard
            icon={<IoPhonePortraitOutline />}
            title={t("card_3_title")}
            descriptionText={t("card_3_description")}
            buttonText={t("card_3_button")}
            navigateTo="/trainers"
          />
        </div>
      </div>
    </section>
  );
};

export default SectionCards;