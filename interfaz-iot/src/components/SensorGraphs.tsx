import mqtt from "mqtt";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Define los tipos de datos para cada sensor
type presionData = { date: string; presion: number };
type AceleracionData = {
  time: string;
  aceleracion1: number;
  aceleracion2: number;
  aceleracion3: number;
};
type VoltajeData = { time: string; valor_analogico: number; voltaje: number };
type DistanciaData = { time: string; dist_cm: number };

const SensorGraphs = () => {
  // Define estados con sus tipos explícitos
  const [dataPresion, setDataPresion] = useState<presionData[]>([]);
  const [dataAceleracion, setDataAceleracion] = useState<AceleracionData[]>([]);
  const [dataVoltaje, setDataVoltaje] = useState<VoltajeData[]>([]);
  const [dataDistancia, setDataDistancia] = useState<DistanciaData[]>([]);

  useEffect(() => {
    // Connect to the MQTT broker
    const client = mqtt.connect("wss://mqtt-dashboard.com:8884/mqtt", {
      clientId: "clientId-hzoqfXo5bS",
    });

    // Topics a suscribirse
    const topics = [
      "xka-presion",
      "xka-aceleracion",
      "xka-voltaje",
      "xka-distancia",
    ];

    client.subscribe(topics);

    client.on("error", (err) => {
      console.error("Error detallado:", err);
    });

    // Manejo de mensajes por topic
    client.on("message", (topic, message) => {
      const now = new Date();
      const timestamp = now.toLocaleTimeString();
      const mensaje = message.toString();

      switch (topic) {
        case "xka-presion": {
          const valor = parseFloat(mensaje);
          setDataPresion((prevData) => [
            ...prevData,
            { date: timestamp, presion: valor },
          ]);
          break;
        }
        case "xka-aceleracion": {
          const [x, y, z] = mensaje.split(",").map(parseFloat);
          setDataAceleracion((prevData) => [
            ...prevData,
            {
              time: timestamp,
              aceleracion1: x,
              aceleracion2: y,
              aceleracion3: z,
            },
          ]);
          break;
        }
        case "xka-voltaje": {
          const [analog, volt] = mensaje.split(",").map(parseFloat);
          setDataVoltaje((prevData) => [
            ...prevData,
            { time: timestamp, valor_analogico: analog, voltaje: volt },
          ]);
          break;
        }
        case "xka-distancia": {
          const distancia = parseFloat(mensaje);
          setDataDistancia((prevData) => [
            ...prevData,
            { time: timestamp, dist_cm: distancia },
          ]);
          break;
        }
        default:
          break;
      }
    });

    // Limpiar al desmontar
    return () => {
      client.end();
    };
  }, []);

  return (
    <div className="container my-5">
      <h2
        className="text-center mb-4"
        style={{ fontWeight: "bold", color: "#444" }}
      >
        Datos de Sensores
      </h2>
      <div className="row">
        {/* Gráfico de presion */}
        <div className="col-md-6 mb-4">
          <h5>Sensor de presión</h5>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataPresion}>
              <Line
                type="monotone"
                dataKey="presion"
                stroke="#FFD700"
                strokeWidth={3}
              />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Aceleración */}
        <div className="col-md-6 mb-4">
          <h5>Sensor de Aceleración</h5>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataAceleracion}>
              <Line
                type="monotone"
                dataKey="aceleracion1"
                stroke="#FFD700"
                strokeWidth={3}
              />
              <Line
                type="monotone"
                dataKey="aceleracion2"
                stroke="#4682B4"
                strokeWidth={3}
              />
              <Line
                type="monotone"
                dataKey="aceleracion3"
                stroke="#FFA500"
                strokeWidth={3}
              />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Voltaje */}
        <div className="col-md-6 mb-4">
          <h5>Sensor de Voltaje</h5>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataVoltaje}>
              <Line
                type="monotone"
                dataKey="valor_analogico"
                stroke="#FFD700"
                strokeWidth={3}
              />
              <Line
                type="monotone"
                dataKey="voltaje"
                stroke="#4682B4"
                strokeWidth={3}
              />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Distancia */}
        <div className="col-md-6 mb-4">
          <h5>Sensor de Distancia</h5>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataDistancia}>
              <Line
                type="monotone"
                dataKey="dist_cm"
                stroke="#FFD700"
                strokeWidth={3}
              />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SensorGraphs;
