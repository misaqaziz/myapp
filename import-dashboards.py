import os
import requests
import json

# Load Grafana Cloud API Key and URL from environment variables
GRAFANA_API_KEY = os.environ["GRAFANA_API_KEY"]
GRAFANA_CLOUD_URL = os.environ["GRAFANA_CLOUD_URL"]
GRAFANA_FOLDER_ID = os.environ.get("GRAFANA_FOLDER_ID", "0")  # 0 means general folder

headers = {
    "Authorization": f"Bearer {GRAFANA_API_KEY}",
    "Content-Type": "application/json"
}

def import_dashboard(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        dashboard_json = json.load(f)

    payload = {
        "dashboard": dashboard_json,
        "folderId": int(GRAFANA_FOLDER_ID),
        "overwrite": True
    }

    url = f"{GRAFANA_CLOUD_URL}/api/dashboards/db"
    response = requests.post(url, headers=headers, json=payload)

    if response.status_code in [200, 202]:
        print(f"✅ Imported: {os.path.basename(filepath)}")
    else:
        print(f"❌ Failed to import {os.path.basename(filepath)} - {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    dashboards_dir = "./dashboards"
    for filename in os.listdir(dashboards_dir):
        if filename.endswith(".json"):
            import_dashboard(os.path.join(dashboards_dir, filename))
