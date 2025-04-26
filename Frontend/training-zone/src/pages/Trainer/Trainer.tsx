import React, { useState } from "react";
import "./Trainer.css";
import NavBar from "../../components/NavBar/NavBar";
import { useParams } from "react-router-dom";

function Trainer() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <h1>Trainer ID not found</h1>;
  }

  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);

  return (
    <>
      <NavBar />
      <main></main>
    </>
  );
}

export default Trainer;
