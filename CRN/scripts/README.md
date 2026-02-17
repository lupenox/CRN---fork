## UWM Events Scraper
This script automates the extraction of all upcoming events from the UWM Campus Calendar. It uses Playwright to handle dynamic "Load More" pagination and saves the output to events.json.

Prerequisites
Python 3.12+

Playwright (with Chromium)

## Option 1: Running in WSL (Linux)
Use these commands if you are working within the Ubuntu/WSL terminal.

Install System Dependencies (Only needed once):

Bash
sudo apt update && sudo apt install -y libnspr4 libnss3 libatk1.0-0t64 libatk-bridge2.0-0t64 libcups2t64 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libasound2t64 libpango-1.0-0 libcairo2
Run the Scraper:

Bash
python3 uwm_scraper.py
Option 2: Running in PowerShell (Windows)
Use these commands if you are running directly in a Windows terminal.

## Option 2: Running in PowerShell (Windows)
Use these commands if you are running directly in a Windows terminal.

Install Requirements:

PowerShell
pip install playwright beautifulsoup4 requests --break-system-packages
python -m playwright install chromium
Run the Scraper:

PowerShell
python uwm_scraper.py
Data Output
File: events.json

Fields: Title, Date, Location, Organizer, Description.

Current Batch: 613 events harvested.