from playwright.sync_api import sync_playwright
import json

def run(playwright):
    # 1. Launch the browser
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("https://uwm.edu/events/")

    print("Page loaded. Starting full data extraction...")

    # 2. Click "Load More" until the button disappears
    while True:
        try:
            # Look for the button and wait up to 3 seconds for it to be ready
            load_more = page.wait_for_selector("button:has-text('Load More')", timeout=3000)
            
            if load_more and load_more.is_visible():
                print("Clicking 'Load More'...")
                load_more.click()
                # Give the page a moment to inject new HTML into the DOM
                page.wait_for_timeout(1500) 
            else:
                print("No more events to load.")
                break
        except:
            # If the selector fails or times out, we've reached the end
            print("Reached the end of the list.")
            break

    # 3. Scrape every card now that the full list is expanded
    all_events = []
    cards = page.query_selector_all(".evnt-block")

    for card in cards:
        title_el = card.query_selector("h2")
        desc_el = card.query_selector(".evnt-desc")
        loc_el = card.query_selector(".evnt-loc")
        spec_el = card.query_selector(".evnt-spc")
        date_el = card.query_selector(".evnt-date")
        
        event_data = {
            "title": title_el.inner_text().strip() if title_el else "No Title",
            "description": desc_el.inner_text().strip() if desc_el else "",
            "location": loc_el.inner_text().strip() if loc_el else "Virtual/Online",
            "organizer": spec_el.inner_text().strip() if spec_el else "UWM",
            "date": date_el.inner_text().strip() if date_el else "TBD"
        }
        all_events.append(event_data)
        print(f"Scraped: {event_data['title']}")

    # 4. Save the full dataset
    with open('events.json', 'w') as f:
        json.dump(all_events, f, indent=4)

    print(f"\nSuccess! Total of {len(all_events)} events harvested.")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)