export type Resource = {
  id: number;
  title: string;
  category: string;
  description: string;
  location: string;
  address: string;
  phone: string;
  website: string;
  hours: string;
  lat: number;
  lng: number;
};

export type MockEvent = {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  organizer: string;
};

export const mockResources: Resource[] = [
  {
    id: 1,
    title: "Tutoring Center",
    category: "Academic Support",
    description:
      "Tutoring and Supplemental Instruction services within the Student Success Center provides UW-Milwaukee undergraduate students with a variety of academic support services including one-on-one tutoring, group sessions, and Supplemental Instruction for historically difficult courses.",
    location: "Bolton Hall",
    address: "Bolton Hall 120, 3210 N Maryland Ave, Milwaukee, WI 53211",
    phone: "(414) 229-4174",
    website: "https://uwm.edu/studentsuccess/tutoring-and-supplemental-instruction/",
    hours: "Mon–Fri 8:00am–7:00pm",
    lat: 43.075858223899246,
    lng: -87.88126185911486,
  },
  {
    id: 2,
    title: "Financial Aid Center",
    category: "Financial Services",
    description:
      "Student Financial Services represents the Offices of Financial Aid Administration, Student Accounts, and Student Scholarships. The Student Financial Service Center serves as students' and families' go-to place for answers to questions about scholarships, financial aid, and billing.",
    location: "Mellencamp Hall",
    address: "Mellencamp Hall 162, 2442 E Kenwood Blvd, Milwaukee, WI 53211",
    phone: "(414) 229-4541",
    website: "https://uwm.edu/finances/",
    hours: "Mon–Fri 8:00am–4:30pm",
    lat: 43.07526489503429,
    lng: -87.8797083279625,
  },
  {
    id: 3,
    title: "Student Dining",
    category: "Food & Dining",
    description:
      "Dining at UWM caters to every taste and lifestyle, while accommodating dietary and nutritional needs and sourcing local and eco-friendly ingredients. Dining options include the Union food court, campus cafes, and the Panther Dining Hall.",
    location: "UWM Student Union",
    address: "2200 E. Kenwood Blvd., Milwaukee, WI 53211",
    phone: "(414) 229-4828",
    website: "https://uwm.edu/dining/",
    hours: "Mon–Fri 7:00am–10:00pm, Sat–Sun 9:00am–8:00pm",
    lat: 43.075220647037334,
    lng: -87.8811638153234,
  },
  {
    id: 4,
    title: "Norris Health Center",
    category: "Health & Wellness",
    description:
      "Norris Health Center provides comprehensive primary care, mental health, and wellness services to currently enrolled UWM students. Services include medical appointments, immunizations, health education, and referrals to community providers.",
    location: "Norris Health Center",
    address: "2025 E Newport Ave, Milwaukee, WI 53211",
    phone: "(414) 229-4716",
    website: "https://uwm.edu/norris/",
    hours: "Mon–Fri 8:00am–4:30pm",
    lat: 43.078587255628314,
    lng: -87.88435600315975,
  },
  {
    id: 5,
    title: "Golda Meir Library",
    category: "Academic Support",
    description:
      "UWM's main library offers extensive print and digital collections, research consultation with subject librarians, group study rooms, computer workstations, interlibrary loan services, and special collections including the American Geographical Society Library.",
    location: "Golda Meir Library",
    address: "2311 E. Hartford Ave., Milwaukee, WI 53211",
    phone: "(414) 229-4785",
    website: "https://uwm.edu/libraries/",
    hours: "Mon–Thu 7:30am–11:00pm, Fri 7:30am–6:00pm, Sat–Sun 10:00am–8:00pm",
    lat: 43.077013575123054,
    lng: -87.88042594548862,
  },
  {
    id: 6,
    title: "UWM Police Department",
    category: "Campus Safety",
    description:
      "The UWM Police Department provides 24/7 law enforcement, emergency response, and safety services for the UWM campus community. Services include escort services, crime reporting, Panther Safe Ride, and emergency blue-light phone stations.",
    location: "Safety Building",
    address: "3351 N Downer Ave, Milwaukee, WI 53211",
    phone: "(414) 229-4627",
    website: "https://uwm.edu/police/",
    hours: "24/7",
    lat: 43.07872768706486,
    lng: -87.87971986491274,
  },
  {
    id: 7,
    title: "IT Help Desk",
    category: "Technology",
    description:
      "UWM's IT Help Desk provides technical support for students, faculty, and staff. Services include help with UWM email, network access, software installation, computer troubleshooting, and access to campus technology resources including Adobe Creative Cloud and Microsoft 365.",
    location: "Bolton Hall",
    address: "Bolton Hall, 3210 N Maryland Ave, Milwaukee, WI 53211",
    phone: "(414) 229-4040",
    website: "https://uwm.edu/technology/",
    hours: "Mon–Fri 8:00am–6:00pm",
    lat: 43.075682246145156,
    lng: -87.88145220825544,
  },
  {
    id: 8,
    title: "Center for Student Experience and Talent",
    category: "Student Life",
    description:
      "The Center for Student Experience and Talent helps students and alumni with career exploration, resume and cover letter reviews, mock interviews, job and internship searches, and networking connections with employers.",
    location: "Vogel Hall",
    address: "Vogel Hall, 3253 N Downer Ave, Milwaukee, WI 53211",
    phone: "(414) 229-4486",
    website: "https://uwm.edu/careerdevelopment/",
    hours: "Mon–Fri 8:30am–4:30pm",
    lat: 43.07695148546668,
    lng: -87.87841100315975,
  },
  {
    id: 9,
    title: "Accessibility Resource Center",
    category: "Student Life",
    description:
      "The Accessibility Resource Center (ARC) provides academic accommodations and support services to students with documented disabilities, including physical, sensory, learning, psychiatric, and chronic health conditions.",
    location: "Mitchell Hall",
    address: "Mitchell Hall 112, 3203 N Downer Ave, Milwaukee, WI 53211",
    phone: "(414) 229-6287",
    website: "https://uwm.edu/drc/",
    hours: "Mon–Fri 8:00am–4:30pm",
    lat: 43.07644783344681,
    lng: -87.87885110315982,
  },
  {
    id: 10,
    title: "Writing Center",
    category: "Academic Support",
    description:
      "The UWM Writing Center offers free one-on-one writing consultations for students at any stage of the writing process. Consultants help with brainstorming, organizing ideas, developing arguments, and improving clarity—for any class, any major.",
    location: "Curtin Hall",
    address: "3243 North Downer Ave, Milwaukee, WI 53211",
    phone: "(414) 229-4339",
    website: "https://uwm.edu/writingcenter/",
    hours: "Mon–Thu 9:00am–7:00pm, Fri 9:00am–2:00pm",
    lat: 43.07660155969166,
    lng: -87.87871384548863,
  },
  {
    id: 11,
    title: "Math Learning Center",
    category: "Academic Support",
    description:
      "The Math Learning Center (MLC) provides free drop-in tutoring for students enrolled in 100- and 200-level mathematics courses. Experienced tutors are available to help with homework, exam preparation, and conceptual understanding.",
    location: "Bolton Hall",
    address: "3210 N Maryland Ave, Milwaukee, WI 53211",
    phone: "(414) 229-4845",
    website: "https://uwm.edu/math/mlc/",
    hours: "Mon–Thu 9:00am–6:00pm, Fri 9:00am–2:00pm",
    lat: 43.07576913309251,
    lng: -87.88121089714102,
  },
  {
    id: 12,
    title: "Counseling Services",
    category: "Health & Wellness",
    description:
      "UWM Counseling Services provides confidential mental health support including individual counseling, group therapy, crisis intervention, and psychiatric services. Open to all currently enrolled UWM students. Same-day crisis appointments available.",
    location: "Mellencamp Hall",
    address: "Mellencamp Hall 129, 2025 E Newport Ave, Milwaukee, WI 53211",
    phone: "(414) 229-4716",
    website: "https://uwm.edu/norris/counseling/",
    hours: "Mon–Fri 8:00am–4:30pm",
    lat: 43.07846578928714,
    lng: -87.88445122157403,
  },
  {
    id: 13,
    title: "International Student Services",
    category: "Student Life",
    description:
      "International Student Services assists international students with immigration advising, F-1 and J-1 visa compliance, cultural adjustment support, and programs that help build community between international and domestic students.",
    location: "Norris Health Center",
    address: "2441 E Hartford Ave, Milwaukee, WI 53211",
    phone: "(414) 229-4846",
    website: "https://uwm.edu/iss/",
    hours: "Mon–Fri 8:00am–4:30pm",
    lat: 43.07722893207982,
    lng: -87.87907625892161,
  },
  {
    id: 14,
    title: "Veterans Resource Center",
    category: "Student Life",
    description:
      "The Veterans Resource Center (VRC) at UWM serves student veterans, service members, and military-connected students. Services include VA benefit certification, academic advising, peer mentoring, a lounge space, and connection to campus and community support.",
    location: "UWM Student Union",
    address: "Student Union 158, 2200 E. Kenwood Blvd., Milwaukee, WI 53211",
    phone: "(414) 229-5560",
    website: "https://uwm.edu/veterans/",
    hours: "Mon–Fri 8:00am–4:30pm",
    lat: 43.074971977709865,
    lng: -87.88174680730121,
  },
  {
    id: 15,
    title: "LGBTQ+ Resource Center",
    category: "Student Life",
    description:
      "The LGBTQ+ Resource Center provides education, advocacy, and support for LGBTQ+ students, staff, and faculty at UWM. Programs include the Preferred title program, Safe Zone training, community events, and access to gender-inclusive restrooms.",
    location: "UWM Student Union",
    address: "Student Union 156, 2200 E. Kenwood Blvd., Milwaukee, WI 53211",
    phone: "(414) 229-5559",
    website: "https://uwm.edu/lgbtrc/",
    hours: "Mon–Fri 9:00am–5:00pm",
    lat: 43.0751018649146,
    lng: -87.88083331066295,
  },
  {
    id: 16,
    title: "Klotsche Center (UREC)",
    category: "Health & Wellness",
    description:
      "The Klotsche Center is UWM's main recreational facility, offering a fitness center, indoor track, basketball courts, racquetball courts, swimming pool, and group fitness classes. All currently enrolled students have free access with a valid UWM ID.",
    location: "Klotsche Center",
    address: "3409 N Downer Ave, Milwaukee, WI 53211",
    phone: "(414) 229-4094",
    website: "https://uwm.edu/urec/",
    hours: "Mon–Fri 6:00am–10:00pm, Sat–Sun 8:00am–8:00pm",
    lat: 43.079507365517514,
    lng: -87.87967543443361,
  },
  {
    id: 17,
    title: "Multicultural Student Center",
    category: "Student Life",
    description:
      "The Multicultural Student Center (MSC) promotes the success of students of color through academic support, mentoring, cultural programming, and community building. The center hosts affinity spaces and coordinates partnerships with culturally specific student organizations.",
    location: "Bolton Hall",
    address: "Bolton Hall, 3210 N Maryland Ave, Milwaukee, WI 53211",
    phone: "(414) 229-5560",
    website: "https://uwm.edu/msc/",
    hours: "Mon–Fri 8:00am–5:00pm",
    lat: 43.076173703956385,
    lng: -87.88109867958609,
  },
  {
    id: 18,
    title: "Student Employment Office",
    category: "Financial Services",
    description:
      "The Student Employment Office connects UWM students with on-campus and federal work-study job opportunities. Services include job listings, hiring paperwork, payroll processing, and resources for students seeking part-time employment while enrolled.",
    location: "UWM Student Union",
    address: "2200 E Kenwood Blvd, Milwaukee, WI 53211",
    phone: "(414) 229-4356",
    website: "https://uwm.edu/financialaid/types-of-aid/employment/",
    hours: "Mon–Fri 8:00am–4:30pm",
    lat: 43.07512765091317,
    lng: -87.88058471814843,
  },
  {
    id: 19,
    title: "Panther Pantry",
    category: "Food & Dining",
    description:
      "The Panther Pantry is a free food pantry open to all UWM students experiencing food insecurity. Students can visit once per week to select from shelf-stable foods, fresh produce, hygiene products, and household supplies—no documentation or proof of need required.",
    location: "UWM Student Union",
    address: "Student Union 154, 2200 E. Kenwood Blvd., Milwaukee, WI 53211",
    phone: "(414) 229-4485",
    website: "https://uwm.edu/studentaffairs/panther-pantry/",
    hours: "Mon–Fri 10:00am–4:00pm",
    lat: 43.075235874191186,
    lng: -87.88235509367746,
  },
  {
    id: 20,
    title: "Office of Student Accounts",
    category: "Financial Services",
    description:
      "The Office of Student Accounts administers federal, state, and institutional financial aid programs including grants, loans, and scholarships. Advisors help students understand their financial aid packages, maintain eligibility, and navigate appeals or special circumstances.",
    location: "Mellencamp Hall",
    address: "2442 E Kenwood Blvd, Milwaukee, WI 53211",
    phone: "(414) 229-4541",
    website: "https://uwm.edu/financialaid/",
    hours: "Mon–Fri 9:00am–4:00pm",
    lat: 43.075317103287794,
    lng: -87.87970472128545,
  },
];

export const mockEvents: MockEvent[] = [
  {
    id: 1,
    title: "FitWell Spring Course Open Enrollment starts December 6",
    description:
      "Spring Forward with FitWell! Discover fun, activity-based undergraduate elective courses designed to boost wellness and balance academic life. Be active, creative, strategic, mindful, competitive and adventurous with courses like weight training, yoga, pickleball, and more.",
    location: "Virtual",
    organizer: "Zilber College of Public Health",
    date: "11/14/2025",
  },
  {
    id: 2,
    title: "FitWell Spring Midterm 7 week Courses Start March 30",
    description:
      "Explore fun, activity-based undergraduate electives to boost wellness and balance academic life. Be active, creative, strategic, mindful, competitive and adventurous with courses like Tennis, Off-Road Bicycling, Pickleball, Fitness, and more.",
    location: "Virtual",
    organizer: "Zilber College of Public Health",
    date: "12/7/2025",
  },
  {
    id: 3,
    title: "American Icons: Sacralizing A Nation",
    description:
      "This exhibition explores the ways that religion has been deeply interwoven into the iconography of the United States. Historically, the term 'icon' (Greek for 'image') is associated with Christian traditions, and this show examines how those traditions have shaped American national symbols.",
    location: "Emile H. Mathis Art Gallery, 3203 North Downer Avenue, Milwaukee, WI 53211",
    organizer: "Letters & Science",
    date: "1/26/2026",
  },
  {
    id: 4,
    title: "Rebellious Stripes: The American Flag in Activist Art, 1960–2025",
    description:
      "The American flag originated as an act of protest. That status intensified in the second half of the twentieth century, as protest movements have used and manipulated the flag in powerful artistic statements.",
    location: "Emile H. Mathis Art Gallery, 3203 North Downer Avenue, Milwaukee, WI 53211",
    organizer: "Letters & Science",
    date: "1/26/2026",
  },
  {
    id: 5,
    title: "K9 Ezmae Art Contest",
    description:
      "The UWM Police Department is sponsoring an art contest from Feb. 2–28. Simply color one of the pre-drawn coloring pages or choose one of our K9 Ezmae inspiration pictures to create your own artwork.",
    location: "— Not Listed —",
    organizer: "UWM Campus Events Calendar",
    date: "2/1/2026",
  },
  {
    id: 6,
    title: "Black History Month Pop-Up Exhibits",
    description:
      "Celebrate Black History Month with UWM Libraries by visiting the three pop-up exhibits hosted by the American Geographical Society Library, Archives, and Special Collections.",
    location: "Golda Meir Library, 2311 E. Hartford Ave., Milwaukee, WI 53211",
    organizer: "Libraries",
    date: "2/2/2026",
  },
  {
    id: 7,
    title: "Fiber//Form 2026",
    description:
      "February 6–20, 2026. Wednesday–Fridays (2–7 p.m.), Saturdays (11 a.m.–3 p.m.). Opening Reception: Friday, February 6 (5–7 p.m.). An exhibition of selected fiber and textile artworks by students from the UWM Peck School of the Arts.",
    location: "Kenilworth Square East, 3rd Floor Gallery, 2155 N. Prospect Ave., Milwaukee, WI 53202",
    organizer: "Peck School of the Arts",
    date: "2/6/2026",
  },
  {
    id: 8,
    title: "UREC Indoor Triathlon",
    description:
      "UREC's Indoor Triathlon returns February 9–20! Students track their progress over two weeks working to complete a Sprint distance triathlon. An exclusive 2026 UREC shirt is included for all participants who finish.",
    location: "Klotsche Center (KC), 3409 North Downer Ave., Milwaukee, WI 53211",
    organizer: "Student Affairs",
    date: "2/9/2026",
  },
  {
    id: 9,
    title: "Intro to Ceramic Hand Building Techniques Session 1",
    description:
      "In this 6-week course, you'll explore the essentials of three different hand-building techniques to create functional and decorative pieces: a textured coaster set, an imaginative trinket box, and a unique sculptural form.",
    location: "UWM Student Union (UN), 2200 East Kenwood Blvd., Milwaukee, WI 53211",
    organizer: "Student Affairs",
    date: "2/9/2026",
  },
  {
    id: 10,
    title: "Intro to Wheel Throwing Session 1",
    description:
      "Discover the craft of wheel throwing in this beginner-level course. We will learn and explore the foundational throwing techniques: centering and pulling clay into a cylinder, then shaping it into a functional bowl or cup.",
    location: "UWM Student Union (UN), 2200 East Kenwood Blvd., Milwaukee, WI 53211",
    organizer: "Student Affairs",
    date: "2/11/2026",
  },
  {
    id: 11,
    title: "Commuter Study Social",
    description:
      "A bi-monthly event hosted by the Off-Campus Resource Center, designed specifically for commuter students who want a welcoming place to study and connect. Held in the OCRC, students can enjoy a quiet study environment alongside their peers.",
    location: "UWM Student Union (UN), 2200 East Kenwood Blvd., Milwaukee, WI 53211",
    organizer: "Student Affairs",
    date: "2/18/2026",
  },
  {
    id: 12,
    title: "Courageous Conversations: 1-800-Relationship Recovery",
    description:
      "With college comes bad breakups, messy falling-outs with friends, and tough talks with family. We'll bring the tissues, you bring tears as we discuss healthy ways to handle heartbreak.",
    location: "First-Generation+ Resource Center (EG39), 2200 East Kenwood Blvd, Milwaukee, WI 53211",
    organizer: "Student Affairs",
    date: "2/18/2026",
  },
  {
    id: 13,
    title: "Pop-In with U.S. Bank",
    description:
      "Join us for an informative session over free popcorn! Students will have the unique opportunity to speak directly with a recruiter from U.S. Bank about potential internship and job opportunities.",
    location: "Lubar Career Center, 3202 N Maryland Ave, Milwaukee, WI 53211",
    organizer: "Center for Student Experience & Talent",
    date: "2/18/2026",
  },
  {
    id: 14,
    title: "Natural Sciences Career Panel",
    description:
      "A great opportunity for networking, asking questions, learning about upcoming internship opportunities, and different avenues to land your dream job. Industry professionals from biology, chemistry, environmental science, and more will be present.",
    location: "Vogel Hall, 3253 N Downer Ave, Milwaukee, WI 53211",
    organizer: "Center for Student Experience & Talent",
    date: "2/18/2026",
  },
  {
    id: 15,
    title: "Nursing Career Fair",
    description:
      "Learn about part-time and full-time job opportunities for registered nurses, nursing students, and certified nursing assistants. Employers from hospitals, clinics, and health systems across the Milwaukee metro area will be in attendance.",
    location: "Cunningham Hall G40, 1921 E Hartford Ave, Milwaukee, WI 53211",
    organizer: "Center for Student Experience & Talent",
    date: "2/18/2026",
  },
  {
    id: 16,
    title: "UREC Climb Night",
    description:
      "Adventure Rock and UWM's Outdoor Pursuits invite you to a FREE night of indoor rock climbing (bouldering and top roping)! Whether it's your 1st time or your 10th, all skill levels are welcome. Equipment provided.",
    location: "Adventure Rock Milwaukee, 2220 N. Commerce St, Milwaukee, WI 53211",
    organizer: "Student Affairs",
    date: "2/18/2026",
  },
  {
    id: 17,
    title: "Practices, Not Prophecies: An Interdisciplinary AI Conversation",
    description:
      "This event brings together faculty, students, and community members from diverse disciplines to discuss how artificial intelligence intersects with creativity, ethics, education, and society. Free and open to the public.",
    location: "Kenilworth Square East Gallery, 2155 N Prospect Ave, Milwaukee, WI 53202",
    organizer: "Center for 21st Century Studies",
    date: "2/18/2026",
  },
  {
    id: 18,
    title: "Stars, Stories, & Rhythms of Africa",
    description:
      "Celebrate Black History Month under the stars! Join us for a night of poetry and stargazing featuring Shelly Conley, Milwaukee's 2025–26 Poet Laureate and community advocate whose work centers the African diaspora.",
    location: "UWM Manfred Olson Planetarium, 1900 E Kenwood Blvd #139, Milwaukee, WI 53211",
    organizer: "UWM Planetarium",
    date: "2/18/2026",
  },
  {
    id: 19,
    title: "Milwaukee Athletics Women's Basketball at Wright State",
    description:
      "Support the UWM Panther Women's Basketball team as they travel to face Wright State. Stream the game live on ESPN+.",
    location: "Nutter Center, Dayton, Ohio",
    organizer: "Panther Athletics",
    date: "2/18/2026",
  },
  {
    id: 20,
    title: "On-campus Employment Resume and Application Workshop",
    description:
      "For students who have applied to on-campus employment several times and want to learn how to improve their application documents. Learn what on-campus employers look for in a resume and how to write a compelling cover letter.",
    location: "Student Union E153, 2200 E Kenwood Blvd., Milwaukee, WI 53211",
    organizer: "Center for Student Experience & Talent",
    date: "2/19/2026",
  },
  {
    id: 21,
    title: "Book Presentation by UWM alum, Gary Hoover, PhD, '93",
    description:
      "We are excited to host UWM alum Gary Hoover, PhD, '93, the celebrated author of 'Ladder or Lottery: Economic Promises and the Reality of Who Gets Ahead.' A Q&A session will follow the presentation.",
    location: "Sheldon B. Lubar College of Business, 3202 N. Maryland Avenue, Milwaukee, WI 53211",
    organizer: "Division of Community Empowerment and Institutional Inclusivity",
    date: "2/19/2026",
  },
  {
    id: 22,
    title: "Power of the Pen: The Art of Loving",
    description:
      "4–5pm | Union 119. Inspired by Olivia Dean's The Art of Loving album, we will delve into the variety of ways love shows up in our lives. Bring a journal or just your thoughts.",
    location: "UWM Student Union (UN), 2200 East Kenwood Blvd., Milwaukee, WI 53211",
    organizer: "Student Affairs",
    date: "2/19/2026",
  },
  {
    id: 23,
    title: "Linocut Relief Printmaking Workshop",
    description:
      "Participants will explore relief printmaking through carving small linoleum blocks, printing by press and by hand, and onto fabric and paper. Great for beginners and experienced printmakers alike. All materials provided.",
    location: "UWM Student Union (UN), 2200 East Kenwood Blvd., Milwaukee, WI 53211",
    organizer: "Student Affairs",
    date: "2/19/2026",
  },
  {
    id: 24,
    title: "Meet the Yard",
    description:
      "Learn more about the Divine Nine (D9) organizations on campus and how to become members. Representatives from all nine historically Black Greek-letter organizations will be present. Business casual attire is required.",
    location: "UWM Student Union (UN), 2200 East Kenwood Blvd., Milwaukee, WI 53211",
    organizer: "Student Affairs",
    date: "2/19/2026",
  },
  {
    id: 25,
    title: "Intro to Stained Glass Session 1",
    description:
      "You will learn how to score, cut, foil, solder, and assemble your own stained-glass motif. Participants choose their own colors for a sunrise pattern. All tools and materials included. No experience required.",
    location: "UWM Student Union (UN), 2200 East Kenwood Blvd., Milwaukee, WI 53211",
    organizer: "Student Affairs",
    date: "2/19/2026",
  },
  {
    id: 26,
    title: "Drylongso Film Screening",
    description:
      "A lost treasure of 1990s DIY filmmaking, Cauleen Smith's Drylongso embeds an incisive look at racial injustice within a lovingly handmade buddy movie/murder mystery/romance. Free and open to all UWM students. Discussion to follow.",
    location: "UWM Student Union (UN), 2200 East Kenwood Blvd., Milwaukee, WI 53211",
    organizer: "Student Affairs",
    date: "2/19/2026",
  },
  {
    id: 27,
    title: "Hub New Music Concert",
    description:
      "UWM's Hub New Music ensemble presents a concert of contemporary chamber works. The program features compositions by living composers spanning experimental, minimalist, and post-classical styles. Free admission for UWM students with valid ID.",
    location: "Helene Zelazo Center for the Performing Arts, 2419 E Kenwood Blvd, Milwaukee, WI 53211",
    organizer: "Peck School of the Arts",
    date: "2/20/2026",
  },
  {
    id: 28,
    title: "Panther Involvement Fair",
    description:
      "Connect with over 200 registered student organizations at UWM's spring involvement fair. Whether you're looking for academic, cultural, recreational, or service opportunities, there's a group for everyone.",
    location: "UWM Student Union (UN), 2200 East Kenwood Blvd., Milwaukee, WI 53211",
    organizer: "Student Affairs",
    date: "2/20/2026",
  },
  {
    id: 29,
    title: "Graduate School Information Session",
    description:
      "Considering graduate school? Join UWM's Graduate School for an overview of application requirements, funding opportunities, and tips for a successful application. Representatives from several graduate programs will be on hand.",
    location: "Mitchell Hall 261, 3203 N Downer Ave, Milwaukee, WI 53211",
    organizer: "Graduate School",
    date: "2/21/2026",
  },
  {
    id: 30,
    title: "Spring Career Fair",
    description:
      "UWM's largest career fair of the semester. Over 100 employers recruiting for internships and full-time positions across all majors. Dress professionally, bring copies of your resume, and visit the Career Development Center for prep resources in advance.",
    location: "UWM Student Union (UN), 2200 East Kenwood Blvd., Milwaukee, WI 53211",
    organizer: "Center for Student Experience & Talent",
    date: "2/25/2026",
  },
];
