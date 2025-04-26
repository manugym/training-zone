import React from "react";
import "./Trainer.css";
import NavBar from "../../components/NavBar/NavBar";
import { useParams } from "react-router-dom";

function Trainer() {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <NavBar />
      <main>
        <h1>Trainer {id} Page</h1>
      </main>
    </>
  );
}

export default Trainer;
