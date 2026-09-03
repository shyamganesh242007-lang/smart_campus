import React, { useState } from 'react';
import { Box, User, Mail, Lock, Eye, EyeOff, Sparkles, ShieldCheck, LayoutDashboard } from 'lucide-react';

export default function Login({ onLogin }) {
  const [activeRole, setActiveRole] = useState('student'); // 'student' | 'staff' | 'admin'
  const [registerNumber, setRegisterNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Auto-fill logic for demonstration purposes
  const handleRoleChange = (role) => {
    setActiveRole(role);
    if (role === 'admin') {
      setRegisterNumber('admin');
      setPassword('admin123');
    } else if (role === 'staff') {
      setRegisterNumber('staff');
      setPassword('staff123');
    } else {
      setRegisterNumber('');
      setPassword('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (registerNumber.trim().length > 0 && password.trim().length > 0) {
      onLogin({
        id: registerNumber.trim(),
        role: activeRole,
        name: activeRole === 'admin' ? 'Campus Admin' : activeRole === 'staff' ? 'Prof. Kumar' : 'Ragul',
        department: activeRole === 'admin' ? 'Administration' : 'Computer Science & Engineering'
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10 animate-in fade-in duration-500">
      
      {/* Premium Glass Login Card */}
      <div className="w-full max-w-[440px] premium-card glow-effect rounded-[28px] p-8 md:p-10 shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-8 duration-700 ease-out border border-[var(--olive-primary)]/20">
        
        {/* Soft blur overlay inside the card to enhance glassmorphism */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-md pointer-events-none z-0"></div>

        <div className="relative z-10 space-y-8">
          
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--olive-primary)] flex items-center justify-center text-[#FFFFFF] shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
              <Box className="w-8 h-8 text-[#FFFFFF]" />
            </div>
            
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
                CAMPUS<span className="text-[var(--olive-primary)]">X</span> AI TWIN
              </h1>
              <p className="text-xs font-bold text-[var(--olive-primary)] tracking-widest uppercase">
                IFET College of Engineering
              </p>
            </div>
            
            <div className="pt-2">
              <h2 className="text-lg font-extrabold text-[var(--text-primary)]">Sign In</h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Select your role to access the Smart Campus Portal.</p>
            </div>
          </div>

          {/* Role Selector Tabs */}
          <div className="flex items-center justify-between p-1.5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/50 backdrop-blur-md relative z-20">
            {['student', 'staff', 'admin'].map(role => (
              <button
                key={role}
                type="button"
                onClick={() => handleRoleChange(role)}
                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${
                  activeRole === role
                    ? 'btn-primary shadow-lg scale-100'
                    : 'text-[var(--text-secondary)] hover:bg-white/60 hover:text-[var(--text-primary)] scale-95'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* ID Input */}
            <div className="space-y-1.5 group">
              <label className="text-xs font-extrabold text-[var(--text-primary)] ml-1">
                {activeRole === 'student' ? 'Register Number' : activeRole === 'staff' ? 'Faculty ID' : 'Admin ID'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-[var(--olive-primary)]/70 group-focus-within:text-[var(--olive-primary)] transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  value={registerNumber}
                  onChange={(e) => setRegisterNumber(e.target.value)}
                  placeholder={activeRole === 'student' ? "e.g., 42112410683" : "Enter your ID"}
                  className="w-full pl-11 pr-4 py-3.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl text-sm font-semibold text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--olive-primary)] focus:border-transparent hover:bg-[#F6F4ED] transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5 group">
              <label className="text-xs font-extrabold text-[var(--text-primary)] ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-[var(--olive-primary)]/70 group-focus-within:text-[var(--olive-primary)] transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl text-sm font-semibold text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--olive-primary)] focus:border-transparent hover:bg-[#F6F4ED] transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--text-secondary)] hover:text-[var(--olive-primary)] transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={registerNumber.trim().length === 0 || password.trim().length === 0}
                className={`w-full py-4 rounded-2xl text-sm font-extrabold uppercase tracking-widest flex items-center justify-center space-x-2 transition-all duration-300 ${
                  registerNumber.trim().length > 0 && password.trim().length > 0
                    ? 'btn-primary'
                    : 'bg-[var(--border-color)] text-[var(--text-secondary)] cursor-not-allowed opacity-60'
                }`}
              >
                <span>Login Securely</span>
              </button>
            </div>
          </form>

          {/* Quick Info Section (Divider + Icons) */}
          <div className="pt-6 border-t border-[var(--border-color)]">
            <div className="flex items-center justify-between text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-wider">
              <div className="flex flex-col items-center space-y-1.5 hover:text-[var(--olive-primary)] transition-colors">
                <ShieldCheck className="w-4 h-4" />
                <span>Secure Login</span>
              </div>
              <div className="flex flex-col items-center space-y-1.5 hover:text-[var(--olive-primary)] transition-colors">
                <LayoutDashboard className="w-4 h-4" />
                <span>{activeRole === 'student' ? 'Student Portal' : activeRole === 'staff' ? 'Faculty Portal' : 'Admin Control'}</span>
              </div>
              <div className="flex flex-col items-center space-y-1.5 hover:text-[var(--olive-primary)] transition-colors">
                <Sparkles className="w-4 h-4" />
                <span>Digital Twin</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
