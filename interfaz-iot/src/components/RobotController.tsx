import React, { useState, useEffect } from "react";
import mqtt from "mqtt";

const RobotController = () => {
  const [client, setClient] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [lastMove, setLastMove] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");

  useEffect(() => {
    // MQTT Connection Parameters
    const mqttClient = mqtt.connect("wss://mqtt-dashboard.com:8884/mqtt");

    mqttClient.on("connect", () => {
      console.log("MQTT Connected");
      setClient(mqttClient);
      setConnectionStatus("Connected");
    });

    mqttClient.on("error", (error) => {
      console.log("MQTT Connection Error:", error);
      setConnectionStatus("Error");
    });

    return () => {
      if (mqttClient) {
        mqttClient.end();
      }
    };
  }, []);

  const sendMQTTMessage = (direction: string) => {
    if (client && client.connected) {
      client.publish("xka-movimiento", direction);
    }
  };

  const moveRobot = (direction) => {
    switch (direction) {
      case "w":
        setPosition((prev) => ({ ...prev, y: prev.y - 1 }));
        setLastMove("Adelante");
        sendMQTTMessage("w");
        break;
      case "a":
        setPosition((prev) => ({ ...prev, x: prev.x - 1 }));
        setLastMove("Derecha");
        sendMQTTMessage("a");
        break;
      case "s":
        setPosition((prev) => ({ ...prev, y: prev.y + 1 }));
        setLastMove("Abajo");
        sendMQTTMessage("s");
        break;
      case "d":
        setPosition((prev) => ({ ...prev, x: prev.x + 1 }));
        setLastMove("Izquierda");
        sendMQTTMessage("d");
        break;
      default:
        break;
    }
  };

  const ButtonGrid = () => (
    <div className="w-48 mx-auto flex flex-col items-center">
      <div className="mb-2">
        <button
          onClick={() => moveRobot("w")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          W
        </button>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => moveRobot("a")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          A
        </button>
        <button
          onClick={() => moveRobot("s")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          S
        </button>
        <button
          onClick={() => moveRobot("d")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          D
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-center">Robot Controller</h2>

      <ButtonGrid />

      <div className="text-center mt-4">
        <p></p>
        <p>Last Move: {lastMove || "None"}</p>
        <p>MQTT Status: {connectionStatus}</p>
      </div>
    </div>
  );
};

export default RobotController;
