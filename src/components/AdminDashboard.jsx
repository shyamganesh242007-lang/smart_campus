import React from 'react';
import { 
  ShieldAlert, Activity, Users, Map, Building2, BellRing, 
  BarChart3, PieChart as PieChartIcon, TrendingUp, AlertOctagon, CheckCircle2, AlertTriangle,
  TreePine, Maximize2, Eye, EyeOff, Flame, Navigation, Layers, Trophy, ArrowRight, Clock, CalendarDays
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TIMETABLE_DATA } from '../data/mockData';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

// --- Premium Toggle Switch Component ---
function PremiumToggle({ checked, onChange, id }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-all duration-250 focus:outline-none focus:ring-2 focus:ring-[var(--olive-primary)] focus:ring-offset-2 ${
        checked 
          ? 'bg-[var(--olive-primary)] border-[var(--olive-primary)] shadow-[0_0_10px_rgba(89,98,74,0.4)]' 
          : 'bg-[var(--bg-secondary)] border-[var(--border-color)]'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 mt-0.5 rounded-full bg-white shadow-md ring-0 transition-all duration-250 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

export default function AdminDashboard({ onNavigateTab }) {
  const { 
    currentUser, 
    attendance, 
    campusStats, 
    triggerEmergency, 
    clearEmergency,
    emergencyAlerts,
    digitalTwin,
    toggleDigitalTwin,
    setDigitalTwinKey,
    heatmapSpots,
    events,
    eventRegistrations
  } = useApp();

  const isEmergencyActive = emergencyAlerts.length > 0;

  const handleEmergencyTrigger = () => {
    if (isEmergencyActive) {
      clearEmergency();
    } else {
      triggerEmergency("FIRE EVACUATION IN PROGRESS. PROCEED TO NEAREST EXIT.");
    }
  };

  const handleEnterFull3D = () => {
    setDigitalTwinKey('isFull3DMode', true);
    onNavigateTab('3d');
  };

  // Heatmap AI insights derived from live heatmapSpots data
  const heatmapInsights = heatmapSpots
    .sort((a, b) => b.crowd - a.crowd)
    .map(spot => ({
      label: spot.label,
      crowd: spot.crowd,
      intensity: spot.intensity,
      color: spot.intensity === 'High' ? 'text-rose-500' : spot.intensity === 'Medium' ? 'text-amber-500' : 'text-green-600',
      bg: spot.intensity === 'High' ? 'bg-rose-50 border-rose-200' : spot.intensity === 'Medium' ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200',
    }));

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 md:px-6 animate-in fade-in duration-500 pb-24">
      
      {/* 1. HACKATHON WINNING FEATURE: Campus Command Center Widget */}
      <div className={`premium-card p-6 md:p-8 rounded-3xl border-2 transition-colors duration-500 bg-[var(--bg-card)] ${isEmergencyActive ? 'border-rose-500 bg-rose-500/5' : 'border-[var(--olive-primary)]/30'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex-1">
            <h2 className="text-2xl font-black text-[var(--text-primary)] flex items-center gap-2 tracking-tight uppercase">
              <Activity className={`w-6 h-6 ${isEmergencyActive ? 'text-rose-500 animate-pulse' : 'text-[var(--olive-primary)]'}`} />
              Live Campus Command Center
            </h2>
            <p className="text-sm font-semibold text-[var(--text-secondary)] mt-1">Smart Campus Operating System • Central Administrator Node</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl">
                <p className="text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-wider">Students On Campus</p>
                <p className="text-2xl font-black text-[var(--text-primary)] mt-1">{campusStats.studentsOnCampus}</p>
              </div>
              <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl">
                <p className="text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-wider">Active Classes</p>
                <p className="text-2xl font-black text-[var(--text-primary)] mt-1">{campusStats.activeClasses}</p>
              </div>
              <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl cursor-pointer hover:border-[var(--olive-primary)] transition-colors" onClick={() => onNavigateTab('events')}>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-wider">Active Events</p>
                  <ArrowRight className="w-3 h-3 text-[var(--olive-primary)]" />
                </div>
                <p className="text-2xl font-black text-[var(--olive-primary)] mt-1">{events.length}</p>
              </div>
              <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl cursor-pointer hover:border-[var(--olive-primary)] transition-colors" onClick={() => onNavigateTab('events')}>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-wider">Total Registered</p>
                  <ArrowRight className="w-3 h-3 text-emerald-600" />
                </div>
                <p className="text-2xl font-black text-emerald-600 mt-1">{eventRegistrations.length}</p>
              </div>
            </div>
          </div>

          {/* Emergency Trigger */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleEmergencyTrigger}
              className={`px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg transition-all hover:-translate-y-0.5 ${
                isEmergencyActive
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                  : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 border border-rose-200'
              }`}
            >
              <AlertOctagon className="w-5 h-5" />
              <span>{isEmergencyActive ? 'Clear SOS Emergency' : 'Broadcast Campus SOS'}</span>
            </button>
            <button
              onClick={() => onNavigateTab('events')}
              className="btn-primary px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md hover:-translate-y-0.5 transition-all"
            >
              <Trophy className="w-4 h-4" />
              <span>Open Event Hub (Manage & Edit)</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. Admin Overview KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Overall Attendance", value: `${attendance.Overall.percentage}%`, icon: Users, color: "text-[var(--olive-primary)]", bg: "bg-[var(--olive-primary)]/10" },
          { label: "Buildings Active", value: "8 / 8", icon: Building2, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Active SOS Alerts", value: emergencyAlerts.length.toString(), icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-500/10" },
          { label: "AI Safety Score", value: "98/100", icon: ShieldAlert, color: "text-green-600", bg: "bg-green-500/10" }
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="premium-card p-5 rounded-2xl border border-[var(--border-color)] flex items-center justify-between group cursor-default bg-[var(--bg-card)]">
              <div>
                <p className="text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-wider">{kpi.label}</p>
                <p className="text-2xl font-black text-[var(--text-primary)] mt-1">{kpi.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl ${kpi.bg} ${kpi.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. AI Powered Attendance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 premium-card p-6 md:p-8 rounded-3xl bg-[var(--bg-card)]">
          <h3 className="text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-[var(--olive-primary)]" />
            Campus-Wide Attendance Trend
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendance.trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--olive-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--olive-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', fontWeight: 'bold' }}
                  itemStyle={{ color: 'var(--olive-primary)' }}
                />
                <Area type="monotone" dataKey="attendance" stroke="var(--olive-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorAtt)" />
                <Area type="monotone" dataKey="predicted" stroke="#f59e0b" strokeWidth={3} strokeDasharray="5 5" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown Donut */}
        <div className="premium-card p-6 md:p-8 rounded-3xl flex flex-col bg-[var(--bg-card)]">
          <h3 className="text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-2 mb-2">
            <PieChartIcon className="w-5 h-5 text-[var(--olive-primary)]" />
            Daily Distribution
          </h3>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={attendance.distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {attendance.distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {attendance.distribution.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-secondary)]">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                {item.name}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Live Class Timings & Attendance Tracker */}
      <div className="premium-card p-6 md:p-8 rounded-3xl bg-[var(--bg-card)]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-[var(--olive-primary)]" />
            Live Class Timings & Attendance Tracker
          </h3>
          <span className="text-[10px] font-bold px-2 py-1 bg-[var(--olive-primary)]/10 text-[var(--olive-primary)] rounded-lg border border-[var(--olive-primary)]/20 uppercase tracking-wider">Today's Schedule</span>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-[var(--border-color)] text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">
                <th className="py-3 px-4">Timing</th>
                <th className="py-3 px-4">Course Code & Subject</th>
                <th className="py-3 px-4">Faculty</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] text-xs font-bold">
              {TIMETABLE_DATA.Today.map((slot, index) => {
                // Mock attendance calculation for demo
                const isBreak = slot.type === 'Break' || slot.type === 'Lunch';
                const totalStudents = isBreak ? 0 : 64;
                const presentStudents = isBreak ? 0 : Math.floor(totalStudents * (0.75 + Math.random() * 0.25));
                const attPercent = isBreak ? 0 : Math.round((presentStudents / totalStudents) * 100);
                
                return (
                  <tr key={index} className="hover:bg-[var(--bg-secondary)]/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-black text-[var(--text-primary)] whitespace-nowrap">
                      {slot.time}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-black text-[var(--text-primary)]">{slot.subject}</p>
                      <p className="text-[10px] font-bold text-[var(--text-secondary)]">{slot.code}</p>
                    </td>
                    <td className="py-3 px-4 text-[var(--text-primary)]">{slot.faculty}</td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-[var(--text-primary)]">{slot.room}</p>
                      <p className="text-[10px] text-[var(--text-secondary)]">{slot.block}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${
                        slot.status === 'Ongoing' ? 'bg-emerald-500 text-white animate-pulse' :
                        slot.status === 'Completed' ? 'bg-slate-200 text-slate-600' :
                        'bg-blue-500/10 text-blue-600'
                      }`}>
                        {slot.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {!isBreak ? (
                        <div className="flex flex-col items-end gap-1">
                          <span className={`font-mono text-sm font-black ${attPercent >= 85 ? 'text-green-600' : attPercent >= 75 ? 'text-amber-500' : 'text-rose-500'}`}>
                            {attPercent}%
                          </span>
                          <span className="text-[10px] font-bold text-[var(--text-secondary)]">{presentStudents} / {totalStudents} Present</span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-[var(--text-secondary)]">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Sub-Panels: CampusAI Insights + Digital Twin Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CampusAI Console */}
        <div className="premium-card p-6 md:p-8 rounded-3xl bg-[var(--bg-card)] border-l-4 border-[var(--olive-primary)]">
          <h3 className="text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-[var(--olive-primary)]" />
            CampusAI Insights
          </h3>
          <div className="space-y-3">
            <div className="p-3.5 bg-[var(--bg-secondary)] rounded-xl text-xs font-semibold border border-[var(--border-color)] shadow-sm flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <p><span className="font-extrabold text-[var(--text-primary)]">Positive Trend:</span> CSE attendance improved 6% this week compared to last month.</p>
            </div>
            <div className="p-3.5 bg-[var(--bg-secondary)] rounded-xl text-xs font-semibold border border-[var(--border-color)] shadow-sm flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <p><span className="font-extrabold text-[var(--text-primary)]">Top Performer:</span> AI & DS department has the highest overall attendance margin (92%).</p>
            </div>
            <div className="p-3.5 bg-[var(--bg-secondary)] rounded-xl text-xs font-semibold border border-[var(--border-color)] shadow-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p><span className="font-extrabold text-[var(--text-primary)]">Prediction:</span> Event participation for HACK-X-IFET is predicted to reach full auditorium capacity.</p>
            </div>
          </div>
        </div>

        {/* Digital Twin Controls */}
        <div className="premium-card p-6 md:p-8 rounded-3xl bg-[var(--bg-card)]">
          <h3 className="text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-2 mb-5">
            <Map className="w-5 h-5 text-[var(--olive-primary)]" />
            Digital Twin Controls
            <span className="ml-auto text-[10px] font-bold px-2 py-1 bg-green-500/10 text-green-600 rounded-lg border border-green-200">LIVE</span>
          </h3>

          <p className="text-[10px] font-semibold text-[var(--text-secondary)] mb-4 pb-3 border-b border-[var(--border-color)]">
            Keyboard shortcuts: <span className="font-extrabold text-[var(--olive-primary)]">L</span> Labels &nbsp;
            <span className="font-extrabold text-[var(--olive-primary)]">H</span> Heatmap &nbsp;
            <span className="font-extrabold text-[var(--olive-primary)]">R</span> Roads &nbsp;
            <span className="font-extrabold text-[var(--olive-primary)]">T</span> Trees &nbsp;
            <span className="font-extrabold text-[var(--olive-primary)]">P</span> POIs &nbsp;
            <span className="font-extrabold text-[var(--olive-primary)]">F</span> Full 3D
          </p>

          <div className="space-y-3">
            {/* Building Labels */}
            <div className="flex items-center justify-between p-3 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] hover:bg-white transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${digitalTwin.showLabels ? 'bg-[var(--olive-primary)]/10 text-[var(--olive-primary)]' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'} transition-colors`}>
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-[var(--text-primary)]">Building Labels</p>
                  <p className="text-[10px] font-semibold text-[var(--text-secondary)]">Floating name tags · Billboard facing</p>
                </div>
              </div>
              <PremiumToggle id="toggle-labels" checked={digitalTwin.showLabels} onChange={() => toggleDigitalTwin('showLabels')} />
            </div>

            {/* Heatmap */}
            <div className="flex items-center justify-between p-3 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] hover:bg-white transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${digitalTwin.showHeatmap ? 'bg-orange-500/10 text-orange-500' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'} transition-colors`}>
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-[var(--text-primary)]">Live Heatmap Overlay</p>
                  <p className="text-[10px] font-semibold text-[var(--text-secondary)]">Crowd density · Ground glow overlay</p>
                </div>
              </div>
              <PremiumToggle id="toggle-heatmap" checked={digitalTwin.showHeatmap} onChange={() => toggleDigitalTwin('showHeatmap')} />
            </div>

            {/* Roads */}
            <div className="flex items-center justify-between p-3 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] hover:bg-white transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${digitalTwin.showRoads ? 'bg-slate-500/10 text-slate-500' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'} transition-colors`}>
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-[var(--text-primary)]">Roads Visibility</p>
                  <p className="text-[10px] font-semibold text-[var(--text-secondary)]">Asphalt roads · Sidewalks · Crosswalks</p>
                </div>
              </div>
              <PremiumToggle id="toggle-roads" checked={digitalTwin.showRoads} onChange={() => toggleDigitalTwin('showRoads')} />
            </div>

            {/* Trees & Landscape */}
            <div className="flex items-center justify-between p-3 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] hover:bg-white transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${digitalTwin.showTrees ? 'bg-green-500/10 text-green-600' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'} transition-colors`}>
                  <TreePine className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-[var(--text-primary)]">Trees & Landscape</p>
                  <p className="text-[10px] font-semibold text-[var(--text-secondary)]">Trees · Grass · Fountain · Decorations</p>
                </div>
              </div>
              <PremiumToggle id="toggle-trees" checked={digitalTwin.showTrees} onChange={() => toggleDigitalTwin('showTrees')} />
            </div>

            {/* Points of Interest */}
            <div className="flex items-center justify-between p-3 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] hover:bg-white transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${digitalTwin.showPOIs ? 'bg-blue-500/10 text-blue-500' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'} transition-colors`}>
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-[var(--text-primary)]">Points of Interest</p>
                  <p className="text-[10px] font-semibold text-[var(--text-secondary)]">Library · Hostel · Cafeteria · Auditorium</p>
                </div>
              </div>
              <PremiumToggle id="toggle-pois" checked={digitalTwin.showPOIs} onChange={() => toggleDigitalTwin('showPOIs')} />
            </div>
          </div>

          {/* Enter Full 3D Button */}
          <button 
            onClick={handleEnterFull3D}
            className="w-full mt-5 btn-primary py-3 rounded-xl text-xs font-extrabold tracking-widest uppercase flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all shadow-md"
          >
            <Maximize2 className="w-4 h-4" />
            Enter Immersive 3D Campus View
          </button>
        </div>

      </div>

      {/* 5. AI Heatmap Live Insights (only shown when heatmap is ON) */}
      {digitalTwin.showHeatmap && (
        <div className="premium-card p-6 md:p-8 rounded-3xl border border-orange-200 bg-orange-50/30 animate-in fade-in duration-300">
          <h3 className="text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
            CampusAI Live Heatmap Insights
            <span className="text-[10px] font-bold px-2 py-1 bg-orange-500/10 text-orange-600 rounded-lg border border-orange-200 ml-auto">LIVE</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {heatmapInsights.map((spot, idx) => (
              <div key={idx} className={`p-4 rounded-xl border ${spot.bg} flex items-center gap-3`}>
                <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center shrink-0">
                  <Flame className={`w-5 h-5 ${spot.color}`} />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-[var(--text-primary)]">{spot.label}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${spot.color}`}>{spot.intensity} Density</p>
                  <p className="text-xs font-semibold text-[var(--text-secondary)] mt-0.5">{spot.crowd} people detected</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

