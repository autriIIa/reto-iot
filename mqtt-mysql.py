import paho.mqtt.client as mqtt
import mysql.connector
from mysql.connector import Error

# Configuración del broker MQTT
BROKER = "broker.hivemq.com"
PORTMQTT = 1883
TOPICS = ["xka-presion", "xka-aceleracion", "xka-voltaje",
          "xka-distancia"]  # Lista de topics a suscribirse

# Configuración de la base de datos MySQL
DB_CONFIG = {
    "host": "localhost",  # Cambia esto si tu base de datos está en otro servidor
    "port": "3308",
    "password": "Arturo2109",  # Contraseña de MySQL
    "database": "RETO_IOT",  # Nombre de tu base de datos
    "user": "root"  # Usuario de MySQL
}

# Crear conexión a la base de datos


def create_connection():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            print("Conectado a la base de datos")
        return connection
    except Error as e:
        print(f"Error al conectar a la base de datos: {e}")
        return None

# Guardar mensaje en la base de datos


def save_message_to_db(connection, topic, message):
    try:
        cursor = connection.cursor()
        if topic == "xka-presion":  # barometro BMP280
            query = "INSERT INTO barometro (id_barometro, id_sensor, presion) VALUES (NULL, %s, %s)"
            cursor.execute(query, (280, float(message)))
        elif topic == "xka-aceleracion":  # acelerometro ADXL345
            print(type(message))
            dato1, dato2, dato3 = message.split(',')
            query = "INSERT INTO acelerometro (id_acelerometro, id_sensor, aceleracion1, aceleracion2, aceleracion3) VALUES (NULL, %s, %s, %s, %s)"
            cursor.execute(query, (345, float(dato1),
                           float(dato2), float(dato3)))
        elif topic == "xka-voltaje":  # ads115 ADS115
            type(message)
            valor_analogico, volts = message.split(',')
            query = "INSERT INTO ADS (id_ADS, id_sensor, valor_analogico, volts) VALUES (NULL, %s, %s, %s)"
            cursor.execute(query, (115, float(
                valor_analogico), float(volts)))
        elif topic == "xka-distancia":  # ultrasonico SR04
            query = "INSERT INTO ultrasonico (id_ultrasonico, id_sensor, distancia) VALUES (NULL, %s, %s)"
            cursor.execute(query, (4, float(message)))
        connection.commit()
        print(f"Mensaje guardado: {message} en el topic: {topic}")
    except Error as e:
        print(f"Error al guardar el mensaje: {e}")

# Callback cuando el cliente se conecta al broker


def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Conexión exitosa al broker")
        for topic in TOPICS:
            client.subscribe(topic)  # Suscribirse a cada topic
            print(f"Suscrito al topic: {topic}")
    else:
        print(f"Error al conectar con el broker, código: {rc}")

# Callback cuando se recibe un mensaje


def on_message(client, userdata, msg):
    print(
        f"Mensaje recibido en el topic '{msg.topic}': {msg.payload.decode()}")
    # Guardar mensaje en la base de datos
    connection = userdata["db_connection"]
    save_message_to_db(connection, msg.topic, msg.payload.decode())


# Configurar el cliente MQTT
client = mqtt.Client()

# Conexión a la base de datos
db_connection = create_connection()
if db_connection is None:
    print("No se pudo conectar a la base de datos. Cerrando...")
    exit(1)

# Pasar la conexión de la base de datos al cliente MQTT
client.user_data_set({"db_connection": db_connection})

client.on_connect = on_connect
client.on_message = on_message

try:
    print(f"Conectando al broker {BROKER}:{PORTMQTT}...")
    client.connect(BROKER, PORTMQTT, 60)
    client.loop_forever()
except KeyboardInterrupt:
    print("Desconectando...")
    client.disconnect()
    if db_connection.is_connected():
        db_connection.close()
except Exception as e:
    print(f"Error: {e}")
    if db_connection.is_connected():
        db_connection.close()
