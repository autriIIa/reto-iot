import React, { useState, useEffect, Fragment } from "react";
import Navbar from "./components/BarNav";
import HeroSection from "./components/HeroSection";
import SensorGraphs from "./components/SensorGraphs";
import EquipoSection from "./components/EquipoSection";
import "./App.css";
import RobotController from "./components/RobotController";

// const client  = mqtt.connect('mqtt://test.mosquitto.org:8081', {
// 	protocol: 'mqtts',
// 	clientId: 'a191124' 	// clientId solo te identifica como un cliente, escoje cualquiercadena que quieras
// });

function App() {
  // Estados para manejar la navegación y los mensajes MQTT
  const [activeSection, setActiveSection] = useState<
    "home" | "graphs" | "equipo"
  >("home");

  // Manejo de la navegación entre secciones
  const handleNavigation = (section: "home" | "graphs" | "equipo") => {
    setActiveSection(section);
  };

  return (
    <>
      <Navbar onNavigate={handleNavigation} />
      <div className="content-container">
        {activeSection === "home" && (
          <HeroSection
            title="Bienvenido al Panel de Control de Nuestro Carrito Inteligente"
            subtitle="¡Revisa las gráficas!"
            imageUrl="/imagen-iot.jpg"
            description="Visualiza datos actualizados en tiempo real recopilados por los sensores."
          />
        )}
        {activeSection === "graphs" && (
          <div className="container py-5">
            <div className="p-4 bg-light shadow rounded custom-card">
              <SensorGraphs />
              <RobotController></RobotController>
            </div>
          </div>
        )}
        {activeSection === "equipo" && (
          <div className="container py-5">
            <EquipoSection
              title="Equipo Esnopi"
              members={[
                "Ximena Silva Bárcena",
                "Ana Keila Martínez Moreno",
                "Arturo Utrilla Hernández",
              ]}
              imageUrl="/equipo.jpg"
            />
          </div>
        )}
      </div>
      <footer className="App-footer"></footer>
    </>
  );
}

export default App;
