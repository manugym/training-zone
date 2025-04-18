import React from "react";
import './Home.css';
import NavBar from "../../components/NavBar/NavBar";
import SectionLogReg from "../../components/HomeSections/SectionLogReg";

const Home: React.FC = () => {
  return (
    <>
    <NavBar />
    <SectionLogReg />
    </>
  )
}

export default Home;
