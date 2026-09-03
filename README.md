# CampusX AI Twin 🎓

An advanced 3D interactive campus twin and AI-powered smart portal built for IFET College of Engineering. This project revolutionizes how students, staff, and admins interact with campus infrastructure, academic data, and emergency services.

## 🚀 Features

* **🌍 3D Campus Navigation**: Interactive 3D visualization of the campus with automated routing to exam halls, classrooms, and event venues.
* **🤖 CampusAI Assistant**: Context-aware AI chatbot that answers queries about attendance margins, timetables, and campus events.
* **👥 Role-Based Dashboards**: Tailored interfaces for Students, Faculty, and Administrators.
* **📊 Academic Analytics**: Real-time attendance calculators, timetable tracking, and exam seat finder.
* **🚨 Emergency SOS System**: 24/7 rapid security and medical response integration with one-click routing to the nearest safe zone.
* **📅 Event & Notice Hub**: Centralized platform for hackathons, college events, and official circulars.

## 💻 Tech Stack

* **Frontend**: React 18, Vite, Tailwind CSS
* **3D Graphics**: Three.js, React Three Fiber, React Three Drei
* **UI/UX & Data Visualization**: Lucide React, Recharts, Canvas Confetti
* **Architecture**: Context API for State Management, Component-Driven Design

## 📂 Folder Structure

```text
src/
├── components/          # Reusable UI and functional components
│   ├── Campus3D.jsx     # 3D rendering and routing logic
│   ├── CampusAI.jsx     # AI chatbot interface
│   ├── Dashboard.jsx    # Student dashboard
│   ├── EmergencySOS.jsx # SOS system
│   └── ...
├── context/             # React Context for global state (AppContext.jsx)
├── data/                # Mock data, buildings info, user profiles
├── App.jsx              # Main application router and layout
├── index.css            # Global styles and Tailwind imports
└── main.jsx             # Entry point
```

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/campusx-ai-ifet.git
   cd campusx-ai-ifet
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:5173`

## 🔮 Future Scope

* **Live Geolocation Tracking**: Integrating GPS to show user's live position on the 3D map.
* **AR Integration**: Adding an Augmented Reality mode for mobile devices to navigate using the camera.
* **Backend API Integration**: Connecting to a live college database for real-time attendance and marks syncing.
* **Multilingual AI**: Allowing CampusAI to answer queries in regional languages.

## 🤝 Team Credits

Built with ❤️ during **[Hackathon Name]**.
* **[Your Name]** - [Your Role]
* **[Teammate 1]** - [Teammate 1 Role]
* **[Teammate 2]** - [Teammate 2 Role]
* **[Teammate 3]** - [Teammate 3 Role]