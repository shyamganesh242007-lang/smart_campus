export const STUDENT_PROFILE = {
  name: "Ragul",
  regNo: "42112410683",
  department: "Computer Science & Engineering",
  year: "3rd Year (VI Semester)",
  section: "CSE-A",
  email: "ragul.cse21@ifet.ac.in",
  dob: "15 Oct 2005",
  avatar: "/ragul-profile.png",
  cgpa: 8.94,
  credits: 98,
  totalCredits: 120,
  attendancePercentage: 84.5,
  attendedClasses: 169,
  totalClasses: 200,
  rank: "3rd in Department",
  adviser: "Dr. Kumar (Prof / CSE)",
  skills: ["AI/ML", "React", "Python", "Data Structures", "Cybersecurity"]
};

export const AI_PRESET_PROMPTS = [
  { label: "My Attendance %", text: "What is my current attendance percentage and safe margin?" },
  { label: "Find Exam Seat", text: "Where is my seat for the CS8591 Computer Networks exam?" },
  { label: "Next Class & Room", text: "What is my next class room number and faculty name?" },
  { label: "Hackathon Pass", text: "How do I register for HACK-X-IFET 2026 hackathon?" }
];

export const QUICK_TILES = [
  { id: 1, title: "3D Campus Twin", desc: "Interactive IFET camera navigation", tab: "3d" },
  { id: 2, title: "CampusAI Chat", desc: "Query attendance, seat & timetable", tab: "ai" },
  { id: 3, title: "Exam Seat Finder", desc: "Hall ticket & seat bench finder", tab: "exam" },
  { id: 4, title: "Attendance Margin", desc: "75% and 85% safe miss calculator", tab: "attendance" },
  { id: 5, title: "Inter-College Events", desc: "Symposia, QR Passes & Hackathons", tab: "events" },
  { id: 6, title: "Timetable & Schedule", desc: "Weekly Anna University schedule", tab: "timetable" }
];

export const BUILDINGS_DATA = [
  {
    id: "main_building",
    name: "IFET Main Building",
    shortName: "Main Building",
    tagline: "Administrative Headquarters & CSE / ECE Wings",
    blockCode: "MB-01",
    floors: 4,
    departments: ["Computer Science & Engg", "Electronics & Comm. Engg", "Admin Office", "Principal Cell"],
    keyLocations: ["Principal Room", "Exam Cell Office", "Main Conference Hall", "CSE HOD Room", "ECE HOD Room"],
    position: [0, 0, -5],
    color: "#3b82f6",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800",
    description: "Iconic white facade structure featuring the majestic central entrance arch. Houses administrative offices, CSE department, and premier computer labs."
  },
  {
    id: "kalam_block",
    name: "A.P.J. Abdul Kalam Block",
    shortName: "Kalam Block",
    tagline: "AI Research Wing & Advanced Computing",
    blockCode: "AKB-02",
    floors: 4,
    departments: ["Artificial Intelligence & DS", "Information Technology"],
    keyLocations: ["Room 269", "Advanced AI Lab", "Cloud Computing Center", "Seminar Hall 2"],
    position: [22, 0, -3],
    color: "#06b6d4",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
    description: "State-of-the-art facility featuring high-performance AI GPU workstations, specialized Room 269 smart hall, and IT department labs."
  },
  {
    id: "visvesvaraya_block",
    name: "Sri M. Visvesvaraya Block",
    shortName: "Visvesvaraya Block",
    tagline: "Mechanical & Civil Engineering Complex",
    blockCode: "MVB-03",
    floors: 3,
    departments: ["Mechanical Engineering", "Civil Engineering"],
    keyLocations: ["CAD/CAM Workshop", "Thermal Engg Lab", "Structural Testing Lab", "CAD Drawing Hall"],
    position: [-22, 0, -3],
    color: "#10b981",
    image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=800",
    description: "Dedicated block equipped with heavy machinery labs, wind tunnels, material testing rigs, and modern CAD workstations."
  },
  {
    id: "central_library",
    name: "IFET Central Library",
    shortName: "Central Library",
    tagline: "Knowledge Repository & Digital Resource Hub",
    blockCode: "LIB-04",
    floors: 2,
    departments: ["Digital Resources", "Journal Archives", "Silent Study Wings"],
    keyLocations: ["IEEE Digital Portal", "E-Book Kiosks", "Research Scholar Cabin", "Book Lending Desk"],
    position: [18, 0, 18],
    color: "#f59e0b",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800",
    description: "Spacious central library housing over 50,000 reference volumes, international journals, digital subscriptions, and 24/7 internet study bays."
  },
  {
    id: "fountain_plaza",
    name: "Central Fountain Plaza",
    shortName: "Fountain Plaza",
    tagline: "Heart of IFET Campus",
    blockCode: "PLZ-00",
    floors: 1,
    departments: ["Campus Greenery", "Student Assembly"],
    keyLocations: ["Tiered Water Fountain", "Botanical Lawns", "Circular Entrance Walkway"],
    position: [0, 0, 12],
    color: "#0284c7",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
    description: "Picturesque circular lawn and tiered fountain located right in front of the main building, providing a vibrant, serene atmosphere."
  },
  {
    id: "basketball_court",
    name: "Sports Complex & Basketball Court",
    shortName: "Basketball Court",
    tagline: "Outdoor Athletics & Recreation Ground",
    blockCode: "SPT-05",
    floors: 1,
    departments: ["Physical Education"],
    keyLocations: ["Synthetic Basketball Court", "Volleyball Court", "Sports Equipment Hub"],
    position: [16, 0, 28],
    color: "#f97316",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=800",
    description: "Flooded synthetic basketball court with standard perimeter fencing and seating for intra-college athletic matches."
  },
  {
    id: "cafeteria",
    name: "IFET Food Court & Cafeteria",
    shortName: "Cafeteria",
    tagline: "Hygienic Dining & Refreshments",
    blockCode: "CAF-06",
    floors: 2,
    departments: ["Student Dining", "Juice & Bakery Zone"],
    keyLocations: ["Main Food Counter", "Fresh Juice Corner", "Outdoor Dining Patio"],
    position: [-22, 0, 18],
    color: "#ec4899",
    image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&q=80&w=800",
    description: "Modern multi-cuisine cafeteria serving hygienic South & North Indian meals, fresh juices, and quick snacks."
  },
  {
    id: "hostels",
    name: "IFET Student Hostels",
    shortName: "Hostels",
    tagline: "Residential Quarters & Mess",
    blockCode: "HST-07",
    floors: 4,
    departments: ["Boys Hostel", "Girls Hostel"],
    keyLocations: ["Warden Office", "Recreation Lounge", "Gymnasium", "Hostel Mess"],
    position: [-22, 0, 32],
    color: "#8b5cf6",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800",
    description: "Comfortable residential blocks equipped with Wi-Fi, study rooms, gym, indoor game lounge, and round-the-clock security."
  },
  {
    id: "auditorium",
    name: "Dr. APJ Abdul Kalam Auditorium",
    shortName: "Auditorium",
    tagline: "Grand Convention & Cultural Center",
    blockCode: "AUD-08",
    floors: 2,
    departments: ["Cultural Club", "Events Cell"],
    keyLocations: ["Main Stage", "Audio-Visual Booth", "VIP Lounge", "Green Rooms"],
    position: [0, 0, -26],
    color: "#6366f1",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800",
    description: "Air-conditioned 1,500-seater auditorium equipped with Dolby surround audio, digital projection systems, and stage lighting."
  }
];

export const TIMETABLE_DATA = {
  Today: [
    { time: "09:00 AM - 09:50 AM", code: "CS8591", subject: "Computer Networks", faculty: "Dr. P. Kausalya", room: "Room 269", block: "A.P.J. Abdul Kalam Block", type: "Lecture", status: "Completed" },
    { time: "09:50 AM - 10:40 AM", code: "AI8301", subject: "Deep Learning & Neural Nets", faculty: "Prof. R. Vignesh", room: "AI Lab (2nd Floor)", block: "A.P.J. Abdul Kalam Block", type: "Lab", status: "Ongoing" },
    { time: "10:40 AM - 11:00 AM", code: "BREAK", subject: "Tea & Refreshments Break", faculty: "-", room: "Cafeteria / Lawn", block: "Campus Plaza", type: "Break", status: "Upcoming" },
    { time: "11:00 AM - 11:50 AM", code: "CS8501", subject: "Theory of Computation", faculty: "Dr. S. Manikandan", room: "Room 269", block: "A.P.J. Abdul Kalam Block", type: "Lecture", status: "Upcoming" },
    { time: "11:50 AM - 12:40 PM", code: "IT8076", subject: "Software Testing & QA", faculty: "Prof. M. Selvi", room: "Room 269", block: "A.P.J. Abdul Kalam Block", type: "Lecture", status: "Upcoming" },
    { time: "12:40 PM - 01:30 PM", code: "LUNCH", subject: "Lunch Break", faculty: "-", room: "IFET Food Court", block: "Cafeteria", type: "Break", status: "Upcoming" },
    { time: "01:30 PM - 03:10 PM", code: "CS8511", subject: "Networks Lab (Batch A)", faculty: "Dr. P. Kausalya / Prof. A. Kumar", room: "Main Network Lab", block: "Main Building (3rd Floor)", type: "Lab", status: "Upcoming" },
    { time: "03:10 PM - 04:00 PM", code: "HS8581", subject: "Professional Communication", faculty: "Prof. N. Meena", room: "Language Lab", block: "Main Building (1st Floor)", type: "Tutorial", status: "Upcoming" }
  ],
  Monday: [
    { time: "09:00 AM - 09:50 AM", code: "CS8591", subject: "Computer Networks", faculty: "Dr. P. Kausalya", room: "Room 269", block: "A.P.J. Abdul Kalam Block", type: "Lecture" },
    { time: "09:50 AM - 10:40 AM", code: "CS8501", subject: "Theory of Computation", faculty: "Dr. S. Manikandan", room: "Room 269", block: "A.P.J. Abdul Kalam Block", type: "Lecture" },
    { time: "11:00 AM - 12:40 PM", code: "AI8301", subject: "Deep Learning Lab", faculty: "Prof. R. Vignesh", room: "AI Lab", block: "A.P.J. Abdul Kalam Block", type: "Lab" },
    { time: "01:30 PM - 03:10 PM", code: "IT8076", subject: "Software Testing", faculty: "Prof. M. Selvi", room: "Room 269", block: "A.P.J. Abdul Kalam Block", type: "Lecture" },
    { time: "03:10 PM - 04:00 PM", code: "LIB", subject: "Library Reference Hour", faculty: "Dr. Central Librarian", room: "Digital Library", block: "Central Library", type: "Self Study" }
  ],
  Tuesday: [
    { time: "09:00 AM - 10:40 AM", code: "CS8511", subject: "Web Technology Lab", faculty: "Prof. K. Rajan", room: "Web Lab 2", block: "Main Building", type: "Lab" },
    { time: "11:00 AM - 11:50 AM", code: "CS8591", subject: "Computer Networks", faculty: "Dr. P. Kausalya", room: "Room 269", block: "A.P.J. Abdul Kalam Block", type: "Lecture" },
    { time: "11:50 AM - 12:40 PM", code: "MA8551", subject: "Algebra & Number Theory", faculty: "Dr. G. Suresh", room: "Room 269", block: "A.P.J. Abdul Kalam Block", type: "Lecture" },
    { time: "01:30 PM - 04:00 PM", code: "PROJ", subject: "Mini Project Work", faculty: "Dr. Kumar", room: "AI Research Center", block: "A.P.J. Abdul Kalam Block", type: "Project" }
  ],
  Wednesday: [
    { time: "09:00 AM - 09:50 AM", code: "MA8551", subject: "Algebra & Number Theory", faculty: "Dr. G. Suresh", room: "Room 269", block: "A.P.J. Abdul Kalam Block", type: "Lecture" },
    { time: "09:50 AM - 10:40 AM", code: "IT8076", subject: "Software Testing & QA", faculty: "Prof. M. Selvi", room: "Room 269", block: "A.P.J. Abdul Kalam Block", type: "Lecture" },
    { time: "11:00 AM - 12:40 PM", code: "CS8501", subject: "Theory of Computation", faculty: "Dr. S. Manikandan", room: "Room 269", block: "A.P.J. Abdul Kalam Block", type: "Lecture" },
    { time: "01:30 PM - 04:00 PM", code: "AI8301", subject: "AI Systems Engineering", faculty: "Prof. R. Vignesh", room: "AI Lab", block: "A.P.J. Abdul Kalam Block", type: "Lab" }
  ],
  Thursday: [
    { time: "09:00 AM - 10:40 AM", code: "CS8591", subject: "Computer Networks", faculty: "Dr. P. Kausalya", room: "Room 269", block: "A.P.J. Abdul Kalam Block", type: "Lecture" },
    { time: "11:00 AM - 12:40 PM", code: "MA8551", subject: "Algebra & Number Theory", faculty: "Dr. G. Suresh", room: "Room 269", block: "A.P.J. Abdul Kalam Block", type: "Lecture" },
    { time: "01:30 PM - 03:10 PM", code: "HS8581", subject: "Placement Aptitude Training", faculty: "External Trainer", room: "Auditorium", block: "Dr. APJ Kalam Auditorium", type: "Placement" },
    { time: "03:10 PM - 04:00 PM", code: "SPORTS", subject: "Sports & Fitness Hour", faculty: "Physical Director", room: "Basketball Court", block: "Sports Complex", type: "Sports" }
  ],
  Friday: [
    { time: "09:00 AM - 09:50 AM", code: "IT8076", subject: "Software Testing", faculty: "Prof. M. Selvi", room: "Room 269", block: "A.P.J. Abdul Kalam Block", type: "Lecture" },
    { time: "09:50 AM - 10:40 AM", code: "CS8501", subject: "Theory of Computation", faculty: "Dr. S. Manikandan", room: "Room 269", block: "A.P.J. Abdul Kalam Block", type: "Lecture" },
    { time: "11:00 AM - 12:40 PM", code: "SEMINAR", subject: "Student Technical Seminar", faculty: "Dr. Kumar", room: "Seminar Hall 2", block: "A.P.J. Abdul Kalam Block", type: "Seminar" },
    { time: "01:30 PM - 04:00 PM", code: "CLUB", subject: "IFET Coding & AI Club Activity", faculty: "Student Leads", room: "AI Lab", block: "A.P.J. Abdul Kalam Block", type: "Club Activity" }
  ]
};

export const EXAM_SEAT_DEMO = {
  regNo: "42112410683",
  studentName: "Ragul",
  department: "B.E. Computer Science & Engineering",
  semester: "Semester VI (Anna University Autonomous End-Sem Exam)",
  subjectCode: "CS8591",
  subjectName: "Computer Networks & Security",
  examDate: "Wednesday, 16 August 2026",
  examTime: "10:00 AM - 01:00 PM (Forenoon)",
  blockName: "A.P.J. Abdul Kalam Block",
  buildingId: "kalam_block",
  floor: "2nd Floor",
  roomNo: "Room 269",
  benchNo: "Row B • Desk #12",
  seatPosition: "Desk #12 (Your Seat)",
  invigilator: "Dr. R. Kavitha (Dept of EEE)",
  hallTicketStatus: "VERIFIED & ISSUED",
  qrPayload: "IFET-EXAM-2026-CS8591-42112410683-ROOM269"
};

export const INTER_COLLEGE_EVENTS = [
  {
    id: "evt-01",
    title: "HACK-X-IFET 2026 24-Hour AI Hackathon",
    hostCollege: "IFET College of Engineering, Villupuram",
    isIFETEvent: true,
    category: "Hackathon",
    date: "August 28 - 29, 2026",
    venue: "Dr. APJ Abdul Kalam Auditorium & AI Lab, IFET",
    targetBuildingId: "auditorium",
    prize: "₹50,000 Cash + Internship Offers",
    teamSize: "2 - 4 Members",
    deadline: "24 Aug 2026",
    fee: "Free Entry",
    matchPercentage: 98,
    description: "National-level 24-hour hackathon focused on Generative AI, Smart City Digital Twins, and Autonomous Drone Systems.",
    banner: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "evt-02",
    title: "NEURAL-CON 2026: National Tech Symposium",
    hostCollege: "IFET College of Engineering (Dept of CSE & AI)",
    isIFETEvent: true,
    category: "Technical",
    date: "September 05, 2026",
    venue: "Main Building & Seminar Hall 2, IFET",
    targetBuildingId: "main_building",
    prize: "₹35,000 Cash + Certificates",
    teamSize: "1 - 3 Members",
    deadline: "30 Aug 2026",
    fee: "₹200 per head",
    matchPercentage: 95,
    description: "Events: Paper Presentation, Bug Hunt, Code-Sprint, Prompt Engineering Battle, and Technical Quiz.",
    banner: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "evt-03",
    title: "CYBER-SHIELD 2026 CTF Challenge",
    hostCollege: "Anna University (CEG Campus), Chennai",
    isIFETEvent: false,
    category: "Technical",
    date: "September 12, 2026",
    venue: "Tag Auditorium, Anna University CEG",
    prize: "₹75,000 Prize Pool",
    teamSize: "1 - 3 Members",
    deadline: "02 Sep 2026",
    fee: "Free",
    matchPercentage: 92,
    description: "Capture-The-Flag challenge involving web exploitation, reverse engineering, forensics, and cryptography.",
    banner: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "evt-04",
    title: "ROBO-BOTIX 2026 Autonomous Line Follower",
    hostCollege: "IIT Madras (Shaastra Tech Fest)",
    isIFETEvent: false,
    category: "Technical",
    date: "September 20, 2026",
    venue: "IIT Madras Research Park",
    prize: "₹1,000,000 Total Pool",
    teamSize: "2 - 5 Members",
    deadline: "10 Sep 2026",
    fee: "₹300",
    matchPercentage: 88,
    description: "Design and program autonomous robotics systems navigating obstacle courses and terrain challenges.",
    banner: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "evt-05",
    title: "DATA-SURGE 2026 Kaggle Competition",
    hostCollege: "SRM Institute of Science & Tech, Kattankulathur",
    isIFETEvent: false,
    category: "Technical",
    date: "October 02, 2026",
    venue: "Online / Tech Park SRM",
    prize: "₹40,000 Cash",
    teamSize: "Individual / Pair",
    deadline: "25 Sep 2026",
    fee: "Free",
    matchPercentage: 94,
    description: "Predictive modeling and deep learning dataset challenge focused on healthcare analytics.",
    banner: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "evt-06",
    title: "Photography Workshop: Campus Lenses",
    hostCollege: "IFET College of Engineering",
    isIFETEvent: true,
    category: "Workshop",
    date: "October 10, 2026",
    venue: "Seminar Hall 2, IFET",
    targetBuildingId: "kalam_block",
    prize: "Certificates & DSLR Giveaways",
    teamSize: "Individual",
    deadline: "05 Oct 2026",
    fee: "₹100",
    matchPercentage: 70,
    description: "Learn professional photography techniques, lighting, and post-processing from industry experts.",
    banner: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "evt-07",
    title: "IFET Cultural Fest 2026",
    hostCollege: "IFET College of Engineering",
    isIFETEvent: true,
    category: "Non-Technical",
    date: "October 15, 2026",
    venue: "Dr. APJ Abdul Kalam Auditorium",
    targetBuildingId: "auditorium",
    prize: "Trophies & Vouchers",
    teamSize: "1 - 10 Members",
    deadline: "12 Oct 2026",
    fee: "Free Entry",
    matchPercentage: 85,
    description: "Annual cultural extravaganza featuring dance, music, drama, and art competitions for all departments.",
    banner: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800"
  }
];

export const SMART_NOTICES = [
  {
    id: "not-01",
    title: "Continuous Assessment Test - II (CAT-2) Schedule Released",
    category: "Urgent",
    date: "12 Aug 2026",
    author: "Controller of Examinations",
    summary: "CAT-2 examinations will commence from August 22, 2026. Hall tickets can be checked on Exam Seat Finder.",
    content: "All students are informed that CAT-2 assessments for Semester VI will take place from August 22 to August 27, 2026. Attendance above 75% is strictly mandatory to sit for exams."
  },
  {
    id: "not-02",
    title: "Registration Open for HACK-X-IFET 2026 AI Hackathon",
    category: "Events",
    date: "11 Aug 2026",
    author: "Department of CSE & AI Club",
    summary: "24-hour national hackathon on Aug 28-29. Register on CAMPUSX Event Hub for instant digital pass.",
    content: "IFET College of Engineering is hosting HACK-X-IFET 2026. Teams can win up to ₹50,000 cash prizes and pre-placement interviews."
  },
  {
    id: "not-03",
    title: "Special Guest Lecture on Cloud Architecture & Kubernetes",
    category: "Important",
    date: "10 Aug 2026",
    author: "Head of Department, CSE",
    summary: "Keynote by Senior AWS Architect on Aug 18, 10:30 AM at APJ Abdul Kalam Auditorium.",
    content: "All 3rd and 4th year CSE/IT students must attend the industry expert talk by Mr. S. Sundaram from AWS India."
  },
  {
    id: "not-04",
    title: "Library Book Renewal & E-Journal Access Upgrade",
    category: "General",
    date: "08 Aug 2026",
    author: "Central Library Office",
    summary: "IEEE Xplore digital library access now active campus-wide via IFET Wi-Fi network.",
    content: "Students can now access over 20,000+ IEEE transactions and conference papers directly through the campus Wi-Fi network."
  }
];

export const EMERGENCY_CONTACTS = [
  { name: "IFET Campus Medical Center", phone: "+91 94432 18901", location: "Main Building Ground Floor (West Wing)", buildingId: "main_building", icon: "Medical" },
  { name: "24x7 Campus Security Patrol", phone: "+91 94432 18900", location: "Main Gate Security Tower", buildingId: "main_building", icon: "Security" },
  { name: "Emergency Fire Response Cell", phone: "+91 94432 18909", location: "Sri M. Visvesvaraya Block Ground Floor", buildingId: "visvesvaraya_block", icon: "Fire" },
  { name: "College Admin Hotline & Helpline", phone: "04146-231456", location: "Main Building Central Office", buildingId: "main_building", icon: "Admin" }
];

export const MY_DAY_TIMELINE = [
  { time: "08:30 AM", title: "College Bus Arrival & Main Gate Entrance", category: "Transit", icon: "Bus" },
  { time: "09:00 AM", title: "CS8591 Computer Networks Lecture", category: "Academics", location: "Room 269, Kalam Block", icon: "BookOpen" },
  { time: "09:50 AM", title: "AI & Neural Nets Hands-on Lab Session", category: "Lab", location: "AI Research Lab, Kalam Block", icon: "Cpu" },
  { time: "10:40 AM", title: "Tea Break & Discussion at Fountain Plaza", category: "Break", location: "Fountain Lawn", icon: "Coffee" },
  { time: "11:00 AM", title: "Theory of Computation Class", category: "Academics", location: "Room 269, Kalam Block", icon: "BookOpen" },
  { time: "12:40 PM", title: "South Indian Buffet Lunch", category: "Food", location: "IFET Cafeteria", icon: "Utensils" },
  { time: "01:30 PM", title: "Computer Networks Lab Practice", category: "Lab", location: "Main Building Networks Lab", icon: "Laptop" },
  { time: "04:10 PM", title: "HACK-X-IFET Hackathon Team Brainstorming", category: "Event", location: "Central Library Study Bay", icon: "Trophy" }
];

export const ATTENDANCE_DATA = {
  Overall: { attended: 169, total: 200, percentage: 84.5, missed: 31, target: 75, streak: 12, bestStreak: 15 },
  Semester: { attended: 169, total: 200, percentage: 84.5, missed: 31, target: 75, streak: 12, bestStreak: 15 },
  'This Month': { attended: 42, total: 50, percentage: 84.0, missed: 8, target: 75, streak: 12, bestStreak: 15 },
  'This Week': { attended: 18, total: 20, percentage: 90.0, missed: 2, target: 75, streak: 4, bestStreak: 5 },
  Today: { attended: 4, total: 4, percentage: 100, missed: 0, target: 75, streak: 1, bestStreak: 1 },
  subjects: [
    { name: 'AI Systems Engg', code: 'AI8301', percentage: 92, status: 'Safe', attended: 46, total: 50, color: '#10b981' },
    { name: 'Machine Learning', code: 'CS8502', percentage: 89, status: 'Safe', attended: 44, total: 49, color: '#10b981' },
    { name: 'Theory of Computation', code: 'CS8501', percentage: 84, status: 'Safe', attended: 42, total: 50, color: '#10b981' },
    { name: 'Computer Networks', code: 'CS8591', percentage: 76, status: 'Warning', attended: 38, total: 50, color: '#f59e0b' },
    { name: 'Cloud Computing', code: 'IT8076', percentage: 72, status: 'Critical', attended: 36, total: 50, color: '#f43f5e' }
  ],
  trend: [
    { name: 'Aug 1', attendance: 86, predicted: null },
    { name: 'Aug 5', attendance: 85, predicted: null },
    { name: 'Aug 10', attendance: 83, predicted: null },
    { name: 'Aug 15', attendance: 82, predicted: null },
    { name: 'Aug 20', attendance: 84, predicted: null },
    { name: 'Aug 25', attendance: 84.5, predicted: null },
    { name: 'Aug 28', attendance: 84.5, predicted: 84.5 },
    { name: 'Aug 30', attendance: null, predicted: 86 },
    { name: 'Sep 5', attendance: null, predicted: 88 }
  ],
  distribution: [
    { name: 'Present', value: 169, color: '#59624A' },
    { name: 'Absent', value: 20, color: '#f43f5e' },
    { name: 'Medical Leave', value: 5, color: '#3b82f6' },
    { name: 'On Duty (OD)', value: 6, color: '#8b5cf6' }
  ],
  calendar: [
    ...Array.from({ length: 30 }, (_, i) => {
      const isWeekend = (i + 1) % 7 === 0 || (i + 1) % 7 === 6;
      if (isWeekend) return { date: i + 1, status: 'holiday', color: '#e5e7eb' };
      if ([4, 12, 13, 22].includes(i + 1)) return { date: i + 1, status: 'absent', color: '#f43f5e' };
      if ([18].includes(i + 1)) return { date: i + 1, status: 'event', color: '#3b82f6' };
      return { date: i + 1, status: 'present', color: '#59624A' };
    })
  ]
};

// ==========================================
// MENTOR INTERVENTION & AT-RISK STUDENTS
// ==========================================
export const DISENGAGED_STUDENTS = [
  {
    id: "stu-101",
    name: "Karthik Raja S",
    regNo: "42112410645",
    department: "Computer Science & Engineering",
    section: "CSE-A",
    year: "3rd Year",
    attendance: 58.4,
    attended: 117,
    total: 200,
    consecutiveMissed: 14,
    riskLevel: "Critical",
    riskColor: "rose",
    disengagementReason: "Consecutive absences in Networks & Theory of Computation lab. Zero hackathon submissions.",
    mentor: "Dr. Kumar (Prof / CSE)",
    mentorEmail: "k.arulmani@ifet.ac.in",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
    status: "Pending Meeting"
  },
  {
    id: "stu-102",
    name: "Sneha V",
    regNo: "42112410689",
    department: "Computer Science & Engineering",
    section: "CSE-A",
    year: "3rd Year",
    attendance: 64.2,
    attended: 128,
    total: 200,
    consecutiveMissed: 8,
    riskLevel: "Critical",
    riskColor: "rose",
    disengagementReason: "Frequent medical leaves without documentation; missed 2 internal assessment tests.",
    mentor: "Dr. S. Kanthimathi (HOD / CSE)",
    mentorEmail: "kanthimathi@ifet.ac.in",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    status: "Scheduled"
  },
  {
    id: "stu-103",
    name: "Vignesh M",
    regNo: "42112410695",
    department: "Computer Science & Engineering",
    section: "CSE-B",
    year: "3rd Year",
    attendance: 71.0,
    attended: 142,
    total: 200,
    consecutiveMissed: 5,
    riskLevel: "Warning",
    riskColor: "amber",
    disengagementReason: "Attendance hovering below 75% cutoff in Cloud Computing (72%). Needs remedial plan.",
    mentor: "Prof. P. Ramesh (Asst. Prof / CSE)",
    mentorEmail: "ramesh.p@ifet.ac.in",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200",
    status: "Action Required"
  },
  {
    id: "stu-104",
    name: "Dharun Kumar",
    regNo: "42112410622",
    department: "Computer Science & Engineering",
    section: "CSE-A",
    year: "3rd Year",
    attendance: 73.5,
    attended: 147,
    total: 200,
    consecutiveMissed: 3,
    riskLevel: "Warning",
    riskColor: "amber",
    disengagementReason: "Short of 3 hours for exam hall ticket approval. Proactive advisory meeting recommended.",
    mentor: "Dr. Kumar (Prof / CSE)",
    mentorEmail: "k.arulmani@ifet.ac.in",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    status: "Completed"
  }
];

export const INITIAL_MENTOR_MEETINGS = [
  {
    id: "meet-01",
    studentId: "stu-102",
    studentName: "Sneha V",
    regNo: "42112410689",
    section: "CSE-A",
    attendance: 64.2,
    mentorName: "Dr. S. Kanthimathi (HOD / CSE)",
    date: "2026-08-30",
    time: "10:30 AM",
    venue: "CSE HOD Cabin (Main Building MB-01, Floor 2)",
    agenda: "Attendance Shortage Intervention & Medical Certificate Verification",
    status: "Confirmed",
    priority: "Urgent",
    notes: "Student notified via SMS and Smart Portal. Parent guardian also informed."
  },
  {
    id: "meet-02",
    studentId: "stu-104",
    studentName: "Dharun Kumar",
    regNo: "42112410622",
    section: "CSE-A",
    attendance: 73.5,
    mentorName: "Dr. Kumar (Prof / CSE)",
    date: "2026-08-28",
    time: "03:00 PM",
    venue: "Staff Cabin 14 (Kalam Block AKB-02)",
    agenda: "Shortage Recovery Plan & Special Weekend Lab Sessions",
    status: "Completed",
    priority: "Normal",
    notes: "Agreed on attending 4 extra lab recovery hours next Saturday."
  }
];

// ==========================================
// GAMIFIED XP SYSTEM & MULTI-TIER LEAGUES
// ==========================================
export const STUDENT_XP_BREAKDOWN = {
  totalXp: 3590,
  level: 14,
  levelTitle: "Apex Innovator",
  nextLevelXp: 4000,
  tier: "Diamond",
  tierBadge: "💎",
  percentile: "Top 2.5% Campus-wide",
  streakDays: 12,
  activities: {
    hackathons: {
      xp: 1250,
      count: 2,
      label: "Hackathons",
      details: "1st Place at Smart Tamil Nadu AI Hackathon (+800 XP) & Finalist at HACK-X-IFET (+450 XP)"
    },
    workshops: {
      xp: 650,
      count: 3,
      label: "Workshops & Tech Bootcamps",
      details: "AWS Cloud Bootcamp (+250 XP), GenAI Prompt Workshop (+200 XP), IEEE IoT Summit (+200 XP)"
    },
    academics: {
      xp: 845,
      count: 8,
      label: "Academic Activities & Coding Contests",
      details: "Top 3 in Data Structures Lab Quiz (+300 XP), 5 CodeChef campus contest streaks (+545 XP)"
    },
    attendance: {
      xp: 845,
      rate: "84.5%",
      label: "Attendance Consistency Multiplier",
      details: "Maintained >80% attendance throughout Semester VI (10x Multiplier = +845 XP)"
    }
  },
  recentBadges: [
    { id: "b1", title: "Hackathon Titan", icon: "Trophy", rarity: "Legendary", desc: "Won Gold in Inter-College Hackathon" },
    { id: "b2", title: "Workshop Master", icon: "Cpu", rarity: "Epic", desc: "Attended 3+ IEEE Technical Seminars" },
    { id: "b3", title: "Attendance Sentinel", icon: "ShieldCheck", rarity: "Rare", desc: "10+ Consecutive Days 100% attendance" },
    { id: "b4", title: "Autonomous Ranker", icon: "Star", rarity: "Epic", desc: "Top 5% CGPA in Anna University Affiliated Wing" }
  ]
};

export const LEAGUE_DATA = {
  class: {
    name: "Class League (CSE-A • 3rd Year)",
    totalMembers: 64,
    userRank: 2,
    rankDelta: "+1",
    leaderboard: [
      { rank: 1, name: "Abinaya S", regNo: "42112410603", xp: 3820, level: 15, tier: "Diamond", hackathons: 3, workshops: 4, attendance: "91.2%", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200", isCurrent: false },
      { rank: 2, name: "Ragul (You)", regNo: "42112410683", xp: 3590, level: 14, tier: "Diamond", hackathons: 2, workshops: 3, attendance: "84.5%", avatar: "/ragul-profile.png", isCurrent: true },
      { rank: 3, name: "Dinesh Kumar R", regNo: "42112410624", xp: 3380, level: 13, tier: "Platinum", hackathons: 2, workshops: 2, attendance: "88.0%", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200", isCurrent: false },
      { rank: 4, name: "Keerthana M", regNo: "42112410651", xp: 3120, level: 12, tier: "Platinum", hackathons: 1, workshops: 3, attendance: "86.4%", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200", isCurrent: false },
      { rank: 5, name: "Harish V", regNo: "42112410639", xp: 2950, level: 11, tier: "Platinum", hackathons: 1, workshops: 2, attendance: "82.1%", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200", isCurrent: false },
      { rank: 6, name: "Naveen Raj P", regNo: "42112410668", xp: 2680, level: 10, tier: "Gold", hackathons: 1, workshops: 1, attendance: "79.5%", avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200", isCurrent: false },
      { rank: 7, name: "Pooja S", regNo: "42112410674", xp: 2420, level: 9, tier: "Gold", hackathons: 0, workshops: 2, attendance: "76.8%", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200", isCurrent: false }
    ]
  },
  department: {
    name: "Department League (Computer Science & Engg)",
    totalMembers: 210,
    userRank: 5,
    rankDelta: "+2",
    leaderboard: [
      { rank: 1, name: "Pradeep R", regNo: "42112410712", section: "CSE-B", xp: 4120, level: 16, tier: "Master", hackathons: 4, workshops: 5, attendance: "94.0%", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200", isCurrent: false },
      { rank: 2, name: "Abinaya S", regNo: "42112410603", section: "CSE-A", xp: 3820, level: 15, tier: "Diamond", hackathons: 3, workshops: 4, attendance: "91.2%", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200", isCurrent: false },
      { rank: 3, name: "Kaviya M", regNo: "42112410755", section: "CSE-C", xp: 3740, level: 15, tier: "Diamond", hackathons: 3, workshops: 3, attendance: "89.5%", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200", isCurrent: false },
      { rank: 4, name: "Gokulnath T", regNo: "42112410738", section: "CSE-B", xp: 3680, level: 14, tier: "Diamond", hackathons: 2, workshops: 4, attendance: "92.0%", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200", isCurrent: false },
      { rank: 5, name: "Ragul (You)", regNo: "42112410683", section: "CSE-A", xp: 3590, level: 14, tier: "Diamond", hackathons: 2, workshops: 3, attendance: "84.5%", avatar: "/ragul-profile.png", isCurrent: true },
      { rank: 6, name: "Dinesh Kumar R", regNo: "42112410624", section: "CSE-A", xp: 3380, level: 13, tier: "Platinum", hackathons: 2, workshops: 2, attendance: "88.0%", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200", isCurrent: false },
      { rank: 7, name: "Siddharth K", regNo: "42112410788", section: "CSE-C", xp: 3290, level: 13, tier: "Platinum", hackathons: 2, workshops: 2, attendance: "83.5%", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200", isCurrent: false }
    ]
  },
  campus: {
    name: "Campus Level League (IFET Grand University League)",
    totalMembers: 4250,
    userRank: 14,
    rankDelta: "+4",
    leaderboard: [
      { rank: 1, name: "Sanjay K", regNo: "42112420501", dept: "AI & Data Science", xp: 4580, level: 18, tier: "Grandmaster", hackathons: 6, workshops: 6, attendance: "96.5%", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200", isCurrent: false },
      { rank: 2, name: "Soundarya T", regNo: "42112430114", dept: "ECE", xp: 4320, level: 17, tier: "Grandmaster", hackathons: 5, workshops: 5, attendance: "95.0%", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200", isCurrent: false },
      { rank: 3, name: "Pradeep R", regNo: "42112410712", dept: "CSE", xp: 4120, level: 16, tier: "Master", hackathons: 4, workshops: 5, attendance: "94.0%", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200", isCurrent: false },
      { rank: 4, name: "Manoj Kumar", regNo: "42112440810", dept: "Information Tech", xp: 3950, level: 15, tier: "Diamond", hackathons: 4, workshops: 3, attendance: "90.5%", avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=200", isCurrent: false },
      { rank: 5, name: "Abinaya S", regNo: "42112410603", dept: "CSE", xp: 3820, level: 15, tier: "Diamond", hackathons: 3, workshops: 4, attendance: "91.2%", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200", isCurrent: false },
      { rank: 14, name: "Ragul (You)", regNo: "42112410683", dept: "CSE", xp: 3590, level: 14, tier: "Diamond", hackathons: 2, workshops: 3, attendance: "84.5%", avatar: "/ragul-profile.png", isCurrent: true }
    ]
  }
};

// ==========================================
// CLASS SECTION STUDENT ROSTERS
// ==========================================
export const SECTION_STUDENTS_LIST = {
  'CSE-A': [
    { roll: "01", regNo: "42112410601", name: "Aakash M", attendance: 92.4, status: "present", consecutiveMissed: 0 },
    { roll: "03", regNo: "42112410603", name: "Abinaya S", attendance: 91.2, status: "present", consecutiveMissed: 0 },
    { roll: "12", regNo: "42112410612", name: "Bhuvanesh R", attendance: 78.5, status: "present", consecutiveMissed: 1 },
    { roll: "18", regNo: "42112410618", name: "Deepak S", attendance: 86.0, status: "present", consecutiveMissed: 0 },
    { roll: "22", regNo: "42112410622", name: "Dharun Kumar", attendance: 73.5, status: "present", consecutiveMissed: 3 },
    { roll: "24", regNo: "42112410624", name: "Dinesh Kumar R", attendance: 88.0, status: "present", consecutiveMissed: 0 },
    { roll: "31", regNo: "42112410631", name: "Gayathri T", attendance: 89.5, status: "present", consecutiveMissed: 0 },
    { roll: "39", regNo: "42112410639", name: "Harish V", attendance: 82.1, status: "present", consecutiveMissed: 0 },
    { roll: "45", regNo: "42112410645", name: "Karthik Raja S", attendance: 58.4, status: "absent", consecutiveMissed: 14 },
    { roll: "51", regNo: "42112410651", name: "Keerthana M", attendance: 86.4, status: "present", consecutiveMissed: 0 },
    { roll: "55", regNo: "42112410655", name: "Lokesh K", attendance: 74.0, status: "present", consecutiveMissed: 2 },
    { roll: "61", regNo: "42112410661", name: "Monisha P", attendance: 90.0, status: "present", consecutiveMissed: 0 },
    { roll: "68", regNo: "42112410668", name: "Naveen Raj P", attendance: 79.5, status: "present", consecutiveMissed: 1 },
    { roll: "74", regNo: "42112410674", name: "Pooja S", attendance: 76.8, status: "present", consecutiveMissed: 2 },
    { roll: "83", regNo: "42112410683", name: "Ragul S", attendance: 84.5, status: "present", consecutiveMissed: 0 },
    { roll: "89", regNo: "42112410689", name: "Sneha V", attendance: 64.2, status: "absent", consecutiveMissed: 8 },
    { roll: "92", regNo: "42112410692", name: "Swetha K", attendance: 87.5, status: "present", consecutiveMissed: 0 },
    { roll: "95", regNo: "42112410695", name: "Vignesh M", attendance: 71.0, status: "absent", consecutiveMissed: 5 }
  ],
  'CSE-B': [
    { roll: "02", regNo: "42112410702", name: "Arunachalam P", attendance: 88.0, status: "present", consecutiveMissed: 0 },
    { roll: "12", regNo: "42112410712", name: "Pradeep R", attendance: 94.0, status: "present", consecutiveMissed: 0 },
    { roll: "25", regNo: "42112410725", name: "Farhana B", attendance: 81.2, status: "present", consecutiveMissed: 1 },
    { roll: "38", regNo: "42112410738", name: "Gokulnath T", attendance: 92.0, status: "present", consecutiveMissed: 0 },
    { roll: "49", regNo: "42112410749", name: "Jeevitha S", attendance: 62.0, status: "absent", consecutiveMissed: 9 },
    { roll: "63", regNo: "42112410763", name: "Mukesh K", attendance: 72.8, status: "present", consecutiveMissed: 3 }
  ],
  'CSE-C': [
    { roll: "05", regNo: "42112410755", name: "Kaviya M", attendance: 89.5, status: "present", consecutiveMissed: 0 },
    { roll: "21", regNo: "42112410771", name: "Ranjith Kumar", attendance: 83.0, status: "present", consecutiveMissed: 0 },
    { roll: "38", regNo: "42112410788", name: "Siddharth K", attendance: 83.5, status: "present", consecutiveMissed: 0 },
    { roll: "44", regNo: "42112410794", name: "Tamilselvi P", attendance: 67.5, status: "absent", consecutiveMissed: 6 }
  ],
  'AI-A': [
    { roll: "01", regNo: "42112420501", name: "Sanjay K", attendance: 96.5, status: "present", consecutiveMissed: 0 },
    { roll: "15", regNo: "42112420515", name: "Ananya R", attendance: 93.0, status: "present", consecutiveMissed: 0 },
    { roll: "28", regNo: "42112420528", name: "Gautham V", attendance: 68.0, status: "absent", consecutiveMissed: 7 }
  ]
};

// ==========================================
// EVENT REGISTRATIONS DIRECTORY
// ==========================================
export const INITIAL_EVENT_REGISTRATIONS = [
  {
    id: "reg-01",
    eventId: "evt-01",
    eventTitle: "HACK-X-IFET 2026 24-Hour AI Hackathon",
    studentName: "Ragul S",
    regNo: "42112410683",
    dept: "B.E CSE (CSE-A)",
    email: "ragul.cse@ifet.ac.in",
    teamName: "Team NeuralByte",
    teamRole: "Team Lead",
    registeredAt: "26 Aug 2026, 11:30 AM",
    passId: "IFET-QR-9842",
    status: "Confirmed"
  },
  {
    id: "reg-02",
    eventId: "evt-01",
    eventTitle: "HACK-X-IFET 2026 24-Hour AI Hackathon",
    studentName: "Abinaya S",
    regNo: "42112410603",
    dept: "B.E CSE (CSE-A)",
    email: "abinaya.cse@ifet.ac.in",
    teamName: "Team NeuralByte",
    teamRole: "ML Architect",
    registeredAt: "26 Aug 2026, 11:35 AM",
    passId: "IFET-QR-9843",
    status: "Confirmed"
  },
  {
    id: "reg-03",
    eventId: "evt-01",
    eventTitle: "HACK-X-IFET 2026 24-Hour AI Hackathon",
    studentName: "Dinesh Kumar R",
    regNo: "42112410624",
    dept: "B.E CSE (CSE-A)",
    email: "dinesh.cse@ifet.ac.in",
    teamName: "Team CyberVanguard",
    teamRole: "Team Lead",
    registeredAt: "26 Aug 2026, 02:15 PM",
    passId: "IFET-QR-9850",
    status: "Confirmed"
  },
  {
    id: "reg-04",
    eventId: "evt-01",
    eventTitle: "HACK-X-IFET 2026 24-Hour AI Hackathon",
    studentName: "Sanjay K",
    regNo: "42112420501",
    dept: "B.Tech AI & Data Science",
    email: "sanjay.ai@ifet.ac.in",
    teamName: "Team VisionForge",
    teamRole: "Team Lead",
    registeredAt: "27 Aug 2026, 09:10 AM",
    passId: "IFET-QR-9861",
    status: "Confirmed"
  },
  {
    id: "reg-05",
    eventId: "evt-02",
    eventTitle: "NEURAL-CON 2026: National Tech Symposium",
    studentName: "Pradeep R",
    regNo: "42112410712",
    dept: "B.E CSE (CSE-B)",
    email: "pradeep.cse@ifet.ac.in",
    teamName: "Individual Entry (Code-Sprint)",
    teamRole: "Solo",
    registeredAt: "27 Aug 2026, 10:45 AM",
    passId: "IFET-QR-8712",
    status: "Confirmed"
  },
  {
    id: "reg-06",
    eventId: "evt-02",
    eventTitle: "NEURAL-CON 2026: National Tech Symposium",
    studentName: "Kaviya M",
    regNo: "42112410755",
    dept: "B.E CSE (CSE-C)",
    email: "kaviya.cse@ifet.ac.in",
    teamName: "Paper Presentation Duo",
    teamRole: "Presenter",
    registeredAt: "27 Aug 2026, 03:20 PM",
    passId: "IFET-QR-8720",
    status: "Confirmed"
  },
  {
    id: "reg-07",
    eventId: "evt-03",
    eventTitle: "CYBER-SHIELD 2026 CTF Challenge",
    studentName: "Swetha K",
    regNo: "42112410692",
    dept: "B.E CSE (CSE-A)",
    email: "swetha.cse@ifet.ac.in",
    teamName: "Team HexExploit",
    teamRole: "Security Analyst",
    registeredAt: "28 Aug 2026, 08:30 AM",
    passId: "IFET-QR-6410",
    status: "Confirmed"
  }
];


