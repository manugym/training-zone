import React from "react";
import './Home.css';
import NavBar from "../../components/NavBar/NavBar";
import SectionLogReg from "../../components/HomeSections/SectionLogReg";
import SectionCards from "../../components/HomeSections/SectionCards";

const Home: React.FC = () => {
  return (
    <>
    <NavBar />
    <SectionLogReg />
    <SectionCards />
    </>
  )
}

export default Home;
