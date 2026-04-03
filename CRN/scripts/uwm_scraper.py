from playwright.sync_api import sync_playwright
import json
from datetime import datetime
import re

def clean_date(date_str):
    if not date_str or "TB" in date_str.upper():
        return "TBD"
    
    try:
        # 1. Standardize dashes
        clean_str = date_str.replace('–', '-').strip()
        
        # 2. If it's a range (e.g., "June 10 - June 11, 2026")
        if '-' in clean_str:
            parts = clean_str.split('-')
            first_part = parts[0].strip() # "June 10"
            
            # If the first part is missing the year, grab it from the end
            if ',' not in first_part:
                year = clean_str.split(',')[-1].strip() # "2026"
                first_part = f"{first_part}, {year}" # "June 10, 2026"
            
            date_obj = datetime.strptime(first_part, "%B %d, %Y")
        
        # 3. If it's a single date (e.g., "February 19, 2026")
        else:
            date_obj = datetime.strptime(clean_str, "%B %d, %Y")
            
        return f"{date_obj.month}/{date_obj.day}/{date_obj.year}"
    
    except:
        # Fallback to original text so no data is lost
        return date_str

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("https://uwm.edu/events/", wait_until="domcontentloaded", timeout=90000)
    print("Page loaded. Starting full data extraction...")

    # Handle the "Load More" button loop
    while True:
        try:
            load_more = page.wait_for_selector("button:has-text('Load More')", timeout=3000)
            if load_more and load_more.is_visible():
                print("Clicking 'Load More'...")
                load_more.click()
                page.wait_for_timeout(1500) 
            else:
                break
        except:
            break

    all_events = []
    cards = page.query_selector_all(".evnt-block")

    for card in cards:
        title_el = card.query_selector("h2")
        # We'll try the most direct path to that span we saw in your screenshot
        date_el = card.query_selector(".evnt-date .size-p-sm")
        
        # If that's empty, we'll try the parent <li> just in case
        if not date_el:
            date_el = card.query_selector(".evnt-date")

        title = title_el.inner_text().strip() if title_el else "Unknown Event"
        
        # This is the moment of truth: grabbing the raw string
        raw_date_string = date_el.inner_text().strip() if date_el else "SELECTOR_FAILED"
        
        print(f"EVENT: {title} | RAW DATE: {raw_date_string}")

        event_data = {
            "title": title,
            "description": card.query_selector(".evnt-desc").inner_text().strip() if card.query_selector(".evnt-desc") else "",
            "location": card.query_selector(".evnt-loc").inner_text().strip() if card.query_selector(".evnt-loc") else "Virtual",
            "organizer": card.query_selector(".evnt-spc").inner_text().strip() if card.query_selector(".evnt-spc") else "UWM",
            "date": clean_date(raw_date_string)  # <--- Update this line here!
        }

        all_events.append(event_data)
        print(f"Scraped & Formatted: {event_data['title']} | {event_data['date']}")

    with open('events.json', 'w') as f:
        json.dump(all_events, f, indent=4)

    print(f"\nSuccess! {len(all_events)} events formatted and harvested.")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)