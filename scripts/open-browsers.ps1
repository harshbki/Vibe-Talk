# Default browser mein dev URLs kholta hai (servers pehle chal rahe hon).
# MongoDB 27017 par HTTP page nahi hota — sirf DB client se connect hota hai.

Start-Process "http://localhost:8080"
Start-Process "http://localhost:8081"
Write-Host "Browser: 8080 = React, 8081 = API (JSON). MongoDB 27017 browser URL nahi hai." -ForegroundColor Green
