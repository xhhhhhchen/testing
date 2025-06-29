import psycopg2
from dotenv import load_dotenv
import os
import schedule
import time
import socket

# Load environment variables from .env file
load_dotenv()
print("🔍 Environment variables loaded.")

# Supabase (User DB)
USER_DB_URL = os.getenv("USER_DB_URL")

# Sensor Database (Tank DB)
TANK_DB_USER = os.getenv("TANK_DB_USER")
TANK_DB_PASSWORD = os.getenv("TANK_DB_PASSWORD")
TANK_DB_HOST = os.getenv("TANK_DB_HOST")
TANK_DB_PORT = os.getenv("TANK_DB_PORT")
TANK_DB_NAME = os.getenv("TANK_DB_NAME")

# Debug print to confirm environment variables
print(f"🧪 USER_DB_URL: {USER_DB_URL}")
print(f"🧪 TANK_DB_HOST: {TANK_DB_HOST}")
print(f"🧪 TANK_DB_NAME: {TANK_DB_NAME}")
print(f"🧪 TANK_DB_USER: {TANK_DB_USER}")

# Threshold values by sensor ID
THRESHOLDS = {
    1: (2121, 3303),  # CO2
    4: (818, 964),    # CH4
    8: (28, 29),      # Soil Temperature
    9: (47, 80),      # Soil Moisture
    10: (4.7, 6),     # Soil pH
    11: (1298, 1958), # Soil EC
    12: (298, 372),   # Soil Nitrogen
    13: (519, 901),   # Soil Phosphorus
    14: (10, 50)      # Soil Potassium change to (515, 900)
}

def get_notification(sensor_name, devicename, value, threshold):
    low, high = threshold
    if value < low:
        header = f"{sensor_name} is too low!"
        message = f"Current {sensor_name} level is {value}, below recommended minimum {low}."
    elif value > high:
        header = f"{sensor_name} is too high!"
        message = f"Current {sensor_name} level is {value}, above recommended maximum {high}."
    else:
        return None
    return {
        "type": "Compost",
        "category": devicename,
        "header": header,
        "message": message
    }

def check_and_notify():
    print("\n🔄 Running check_and_notify...")
    try:
        print("🌐 Connecting to Sensor DB...")
        sensor_conn = psycopg2.connect(
            user=TANK_DB_USER,
            password=TANK_DB_PASSWORD,
            host=TANK_DB_HOST,
            port=TANK_DB_PORT,
            dbname=TANK_DB_NAME,
            connect_timeout=10
        )
        sensor_cur = sensor_conn.cursor()

        print("📅 Fetching latest sensor data...")
        sensor_cur.execute("""
            SELECT DISTINCT ON (dev.devicename, sen.sensorid)
              dev.devicename,
              loc.locationid,
              loc.locationname,
              sen.sensorid,
              sen.sensor,
              sdata.value,
              TO_CHAR(ddata.dbtimestamp, 'DD/MM/YYYY HH24:MI') AS formatted_timestamp
            FROM sensordata sdata
            JOIN devicedata ddata ON sdata.devicedataid = ddata.devicedataid
            JOIN devices dev ON ddata.deviceid = dev.deviceid
            JOIN locations loc ON dev.locationid = loc.locationid
            JOIN devicesensors ds ON ds.sensorid = sdata.sensorid AND ds.deviceid = dev.deviceid
            JOIN sensors sen ON sen.sensorid = sdata.sensorid
            WHERE ddata.dbtimestamp >= NOW() - INTERVAL '1 minutes'
            ORDER BY dev.devicename, sen.sensorid, ddata.dbtimestamp DESC;
        """)
        rows = sensor_cur.fetchall()
        print(f"📊 Retrieved {len(rows)} sensor rows.")
        sensor_cur.close()
        sensor_conn.close()

        print("🌐 Connecting to Supabase DB...")
        supabase_conn = psycopg2.connect(USER_DB_URL, sslmode='require')
        supabase_cur = supabase_conn.cursor()

        for row in rows:
            devicename, location_id, _, sensorid, sensor_name, value, formatted_timestamp = row
            if sensorid in THRESHOLDS:
                note = get_notification(sensor_name, devicename, value, THRESHOLDS[sensorid])
                if note:
                    supabase_cur.execute("""
                        INSERT INTO notifications (timestamp, type, category, header, message, location_id)
                        VALUES (%s, %s, %s, %s, %s, %s)
                    """, (
                        formatted_timestamp,
                        note["type"],
                        note["category"],
                        note["header"],
                        note["message"],
                        location_id
                    ))
                    print(f"✅ Notification inserted for {devicename}: {note['header']}")
                else:
                    print(f"🟢 {sensor_name} OK on {devicename}: {value}")

        supabase_conn.commit()
        supabase_cur.close()
        supabase_conn.close()
        print("✔️ Done checking.\n")

    except Exception as e:
        print(f"❌ Error during check: {e}")

# Run once at startup
check_and_notify()

# Schedule to run every hour
schedule.every(1).hours.do(check_and_notify)
print("📡 Monitoring started. Press Ctrl+C to stop.\n")

while True:
    schedule.run_pending()
    time.sleep(1)