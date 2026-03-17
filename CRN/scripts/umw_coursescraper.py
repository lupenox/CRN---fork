import requests
import json
import time
import re

SEMESTER_VALUE = "2262"   # 2259=Fall 2025 | 2261=UWinteriM 2026
                           # 2262=Spring 2026 | 2266=Summer 2026
SUBJECTS    = None
OUTPUT_FILE = "uwm_courses.json"
DETAIL_DELAY = 0.15

ALL_SUBJECTS = [
    "AMLLC","ACTSCI","AD LDSP","AFAS","AFRIC","AIS","ANTHRO","ARABIC","ARCH",
    "ART","ART ED","ARTHIST","ASIANST","ASL","ASTRON","ATM SCI","ATRAIN",
    "BIO SCI","BME","BMS","BUS ADM","BUSMGMT","CELTIC","CES","CHEM","CHINESE",
    "CHPS","CIV ENG","CLASSIC","COMMUN","COMPLIT","COMPSCI","COMPST","COMSDIS",
    "COUNS","CRM JST","CURRINS","DAC","DANCE","DMI","EAP","EAS","ECE","ECON",
    "ED POL","ED PSY","EDUC","ELECENG","ENGLISH","ETHNIC","EXCEDUC","FILM",
    "FILMSTD","FINEART","FITWELL","FOODBEV","FRENCH","FRSHWTR","GEO SCI","GEOG",
    "GERMAN","GLOBAL","GRAD","GREEK","HCA","HEBREW","HI","HIST","HMONG","HONORS",
    "HS","IEP","IND ENG","IND REL","INFOST","INTLST","ITALIAN","JAMS","JAPAN",
    "JEWISH","KIN","KOREAN","L&S HUM","L&S NS","L&S SS","LACS","LACUSL","LATIN",
    "LATINX","LGBT","LIBRLST","LINGUIS","MALLT","MATH","MATLENG","MECHENG",
    "MIL SCI","MSP","MTHSTAT","MUS ED","MUSIC","MUSPERF","NEURO","NONPROF",
    "NURS","NUTR","OCCTHPY","PEACEST","PH","PHILOS","PHYSICS","POL SCI","POLISH",
    "PORTUGS","PRPP","PSYCH","PT","PUB ADM","RELIGST","RUSSIAN","SCNDVST",
    "SOC WRK","SOCIOL","SPANISH","TCH LRN","THEATRE","THERREC","TRNSLTN",
    "URB STD","URBPLAN","UWS NSG","WGS","WLC",
]

SEARCH_URL = "https://catalog.uwm.edu/course-search/api/?page=fose&route=search"
DETAIL_URL = "https://catalog.uwm.edu/course-search/api/?page=fose&route=details"

HEADERS = {
    "Content-Type":     "application/json",
    "Accept":           "application/json, text/javascript, */*; q=0.01",
    "X-Requested-With": "XMLHttpRequest",
    "Referer":          f"https://catalog.uwm.edu/course-search/?srcdb={SEMESTER_VALUE}",
    "User-Agent":       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
}


def extract_rooms(meeting_html: str) -> list:
    rooms = []
    for match in re.finditer(
        rf'class="meet-room-{SEMESTER_VALUE}">\s*in\s*(.*?)</span>',
        meeting_html
    ):
        room = match.group(1).strip()
        room = re.sub(r'^\([^)]+\)\s*', '', room).strip()
        if room:
            rooms.append(room)
    return rooms


def fetch_subject(subject: str) -> list:
    payload = {
        "other":    {"srcdb": SEMESTER_VALUE},
        "criteria": [{"field": "subject", "value": subject}],
    }
    resp = requests.post(SEARCH_URL, headers=HEADERS, json=payload, timeout=30)
    resp.raise_for_status()
    return resp.json().get("results", [])


def fetch_detail(course_code: str, crn: str) -> dict:
    payload = {
        "group":   f"code:{course_code}",
        "key":     f"crn:{crn}",
        "srcdb":   SEMESTER_VALUE,
        "matched": f"crn:{crn}",
    }
    try:
        resp = requests.post(DETAIL_URL, headers=HEADERS, json=payload, timeout=30)
        resp.raise_for_status()
        return resp.json()
    except Exception:
        return {}


def parse_meeting_times(raw: str) -> list:
    DAY_MAP = {"0": "Mon", "1": "Tue", "2": "Wed", "3": "Thu",
               "4": "Fri", "5": "Sat", "6": "Sun"}
    try:
        times = json.loads(raw) if isinstance(raw, str) else raw
        parsed = []
        for t in times:
            start = t.get("start_time", "")
            end   = t.get("end_time", "")
            def fmt(t_str):
                if not t_str:
                    return ""
                t_str = t_str.zfill(4)
                h, m   = int(t_str[:2]), int(t_str[2:])
                suffix = "AM" if h < 12 else "PM"
                h12    = h % 12 or 12
                return f"{h12}:{m:02d} {suffix}"
            parsed.append({
                "day":        DAY_MAP.get(str(t.get("meet_day", "")), ""),
                "start_time": fmt(start),
                "end_time":   fmt(end),
            })
        return parsed
    except Exception:
        return []


def run():
    subjects_to_scrape = SUBJECTS if SUBJECTS else ALL_SUBJECTS
    all_courses        = []

    for i, subject in enumerate(subjects_to_scrape, 1):
        try:
            results = fetch_subject(subject)
            if not results:
                print(f"  [{i}/{len(subjects_to_scrape)}] {subject:<12} — 0 sections")
                continue

            for item in results:
                all_courses.append({
                    "course_code":   item.get("code", ""),
                    "title":         item.get("title", ""),
                    "crn":           item.get("crn", ""),
                    "section":       item.get("no", ""),
                    "schedule_type": item.get("schd", ""),
                    "meets":         item.get("meets", ""),
                    "meeting_times": parse_meeting_times(item.get("meetingTimes", "[]")),
                    "instructor":    item.get("instr", ""),
                    "campus":        "",  # filled in phase 2 from instructional_method
                    "room":          "",  # filled in phase 2 from meeting_html
                })


        except Exception as e:
            print(f"  [{i}/{len(subjects_to_scrape)}] {subject:<12} — ERROR: {e}")


    for i, course in enumerate(all_courses, 1):
        detail = fetch_detail(course["course_code"], course["crn"])

        if detail:
            course["campus"] = detail.get("instructional_method", "")

            meeting_html = detail.get("meeting_html", "")
            if meeting_html:
                rooms = extract_rooms(meeting_html)
                if len(rooms) == 1:
                    course["room"] = rooms[0]
                elif len(rooms) > 1:
                    course["room"] = rooms

        time.sleep(DETAIL_DELAY)

    # ── Save ──────────────────────────────────────────────────────────────────
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(all_courses, f, indent=4)

if __name__ == "__main__":
    run()