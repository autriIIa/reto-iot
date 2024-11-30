import time
import board
import adafruit_bmp280
import paho.mqtt.client as mqtt
import RPi.GPIO as GPIO
import busio
import adafruit_adxl34x
import adafruit_ads1x15.ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn
import RPi.GPIO as GPIO
from time import sleep

import time

# Configuración de los pines para los motores
GPIO.setmode(GPIO.BOARD)

in1 = 36  # Entrada para el motor 1
in2 = 38  # Entrada para el motor 1
enable1 = 40  # Habilita el motor 1

in3 = 22  # Entrada para el motor 2
in4 = 24  # Entrada para el motor 2
enable2 = 26  # Habilita el motor 2

# Configuración de los pines como salidas
GPIO.setup(in1, GPIO.OUT)
GPIO.setup(in2, GPIO.OUT)
GPIO.setup(enable1, GPIO.OUT)
GPIO.setup(in3, GPIO.OUT)
GPIO.setup(in4, GPIO.OUT)
GPIO.setup(enable2, GPIO.OUT)

# Solicitar dirección al usuario
ans = input("Ingresa una direccion (adelante, atras, izquierda, derecha): ")

if ans == "atras":
    print("atras")
    GPIO.output(in1, GPIO.HIGH)
    GPIO.output(in2, GPIO.LOW)
    GPIO.output(enable1, GPIO.HIGH)
    GPIO.output(in3, GPIO.HIGH)
    GPIO.output(in4, GPIO.LOW)
    GPIO.output(enable2, GPIO.HIGH)
    sleep(3)

elif ans == "adelante":
    print("Avanzando adelante")
    # Motor 1 avanza
    GPIO.output(in1, GPIO.LOW)  # Motor 1 hacia adelante
    GPIO.output(in2, GPIO.HIGH)
    GPIO.output(enable1, GPIO.HIGH)
    # Motor 2 avanza
    GPIO.output(in3, GPIO.LOW)  # Motor 2 hacia adelante
    GPIO.output(in4, GPIO.HIGH)
    GPIO.output(enable2, GPIO.HIGH)
    sleep(3)


elif ans == "izquierda":
    print("Girando a la izquierda")
    # Motor 1 retrocede
    GPIO.output(in1, GPIO.LOW)
    GPIO.output(in2, GPIO.HIGH)
    GPIO.output(enable1, GPIO.HIGH)
    # Motor 2 avanza
    GPIO.output(in3, GPIO.HIGH)
    GPIO.output(in4, GPIO.LOW)
    GPIO.output(enable2, GPIO.HIGH)
    sleep(3)

elif ans == "vueltas":
    print("vueltas")
    GPIO.output(in1, GPIO.HIGH)
    GPIO.output(in2, GPIO.LOW)
    GPIO.output(enable1, GPIO.HIGH)
    GPIO.output(in3, GPIO.LOW)
    GPIO.output(in4, GPIO.HIGH)
    GPIO.output(enable2, GPIO.HIGH)
    sleep(3)


elif ans == "derecha":
    print("Girando a la derecha")
    # Motor 1 avanza
    GPIO.output(in1, GPIO.HIGH)
    GPIO.output(in2, GPIO.LOW)
    GPIO.output(enable1, GPIO.HIGH)
    # Motor 2 retrocede
    GPIO.output(in3, GPIO.LOW)
    GPIO.output(in4, GPIO.HIGH)
    GPIO.output(enable2, GPIO.HIGH)
    sleep(3)

else:
    print("Comando no reconocido")

# Detener los motores
print("Detener")
GPIO.output(in1, GPIO.LOW)
GPIO.output(in2, GPIO.LOW)
GPIO.output(enable1, GPIO.LOW)
GPIO.output(in3, GPIO.LOW)
GPIO.output(in4, GPIO.LOW)
GPIO.output(enable2, GPIO.LOW)

# Limpiar los pines
GPIO.cleanup()

# Configuracion del BME
i2c = board.I2C()
# se ponen la direccion de los 3 sensores (adc, bmp, axl)
bmp280 = adafruit_bmp280.Adafruit_BMP280_I2C(i2c, address=0x76)
bmp280.sea_level_pressure = 1013.25

# Configuracion del aceletrometro
mide = adafruit_adxl34x.ADXL345(i2c, address=0x53)

# Configuracion del ADC
ads = ADS.ADS1115(i2c, address=0x48)
channel = AnalogIn(ads, ADS.P0)

# Configuracion del motor de distancia

GPIO.setmode(GPIO.BCM)
# GPIO.setwarnings(False)

TRIG = 23
ECHO = 24

print("medicion en progreso")
GPIO.setup(TRIG, GPIO.OUT)
GPIO.setup(ECHO, GPIO.IN)

GPIO.output(TRIG, False)
print("esperando datos")
time.sleep(1)
GPIO.output(TRIG, True)
time.sleep(0.00001)
GPIO.output(TRIG, False)

while GPIO.input(ECHO) == 0:
    pulse_start = time.time()

while GPIO.input(ECHO) == 1:
    pulse_end = time.time()

pulso_dura = pulse_end - pulse_start

dist = pulso_dura * 17150
dist = round(dist, 2)


# Funcion de MQTT
def on_publish(client, userdata, mid, reason_code, properties):
    try:
        userdata.remove(mid)
    except KeyError:
        print("Error")


unacked_publish = set()
mqttc = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
mqttc.on_publish = on_publish

mqttc.user_data_set(unacked_publish)
-------------mqttc.loop_start()

# Publicar en topic 1  ||
msg_info = mqttc.publish(
    "xka-presion", "\n%0.1f" % bmp280.temperature, qos=0)
print("se pudo")
unacked_publish.add(msg_info.mid)

# Publicar en topic 2 ||
msg_info2 = mqttc.publish("xka-aceleracion", "%f, %f, %f" %
                          mide.acceleration, qos=0)
unacked_publish.add(msg_info2.mid)

# Publicar en topic 3 || Valor analogico: %d , volts: %.2f
msg_info3 = mqttc.publish("xka-voltaje", "%d, %.2f" %
                          (channel.value, channel.voltage), qos=0)
unacked_publish.add(msg_info3.mid)

# Publicar en topic 4 || Distancia
msg_info4 = mqttc.publish(
    "xka-distancia", "%f" % dist, qos=0)
unacked_publish.add(msg_info4.mid)

# Esperando a publicar el mensaje
while len(unacked_publish):
    time.sleep(0.1)

msg_info.wait_for_publish()
msg_info2.wait_for_publish()
msg_info3.wait_for_publish()
msg_info4.wait_for_publish()

mqttc.disconnect()
mqttc.loop_stop()
