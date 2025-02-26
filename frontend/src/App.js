import React from "react";
import { Container } from "@mui/material";
import VaccinationForm from "./components/vaccinationforms";

function App() {
  return (
    <Container>
      <h2>NHS Vaccination Add-in</h2>
      <VaccinationForm />
    </Container>
  );
}

export default App;
