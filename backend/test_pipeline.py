import requests, time, json

payload = {
    "raw_input": "Swiggy - Rs.450 - 2026-04-01\nUber - Rs.180 - 2026-04-01\nNetflix - Rs.649 - 2026-04-02\nZomato - Rs.380 - 2026-04-03\nAmazon - Rs.2499 - 2026-04-05",
    "stipend": 15000,
    "goal": "Buy a Laptop"
}

print("Submitting...")
r = requests.post("http://127.0.0.1:8001/api/expense-analysis/submit", json=payload)
print("Submit response:", r.status_code, r.json())

pid = r.json()["payload_id"]

for i in range(20):
    time.sleep(3)
    s = requests.get("http://127.0.0.1:8001/api/expense-analysis/status/" + pid)
    data = s.json()
    status = data.get("status", "unknown")
    print("Poll", i+1, ":", status)
    if status in ("completed", "error"):
        print(json.dumps(data, indent=2))
        break
