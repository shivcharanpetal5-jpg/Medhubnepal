
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import DoseCalculator from './components/DoseCalculator';
import BloodGroupAnalyzer from './components/BloodGroupAnalyzer';
import CompatibilityChart from './components/CompatibilityChart';
import DueDateCalculator from './components/DueDateCalculator';
import TransportBooking from './components/TransportBooking';
import UrineAnalyzer from './components/UrineAnalyzer';
import SkinAnalyzer from './components/SkinAnalyzer';
import XrayAnalyzer from './components/XrayAnalyzer';
import { DISCLAIMER_TEXT } from './constants';
import { TabType } from './types';
import { ArrowRight, ShieldCheck, Phone, Heart, Baby, Truck, FlaskConical, Hand, ScanLine } from 'lucide-react';

// --- Medical Rain Animation Component ---
const MedicalRain: React.FC = () => {
  // Generate static random values for drops to avoid re-renders causing jumps
  const drops = React.useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    duration: 3 + Math.random() * 4, // Slower, more calming
    delay: Math.random() * 5
  })), []);

  return (
    <div className="rain-container">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="drop"
          style={{
            left: `${drop.left}%`,
            animationDuration: `${drop.duration}s`,
            animationDelay: `${drop.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

// --- Sub-Views ---

const HomeView: React.FC<{ setTab: (t: TabType) => void }> = ({ setTab }) => (
  <div className="space-y-12 animate-fade-in max-w-5xl mx-auto">
    <div className="text-center space-y-6 py-10">
      <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
        QuickMed <span className="text-medical-600">Nepal</span>
      </h1>
      <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
        Fast, safe medical tools for everyone. Dosage calculators, lab test analysis, and emergency resources in one secure hub.
      </p>
      <div className="flex flex-wrap justify-center gap-4 pt-4">
        <button 
          onClick={() => setTab('calculator')}
          className="px-8 py-4 bg-medical-600 hover:bg-medical-700 text-white rounded-xl font-bold shadow-lg shadow-medical-200 transition-all transform hover:-translate-y-1 flex items-center"
        >
          Syrup Dose Calc <ArrowRight className="ml-2" size={20} />
        </button>
        <button 
          onClick={() => setTab('analyzer')}
          className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold shadow-sm transition-all flex items-center"
        >
          Check Blood Slide
        </button>
      </div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div 
        onClick={() => setTab('calculator')}
        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4">
          <ShieldCheck size={24} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Safe Dosing</h3>
        <p className="text-slate-500 text-sm">Pediatric weight-based calculations.</p>
      </div>
      <div 
        onClick={() => setTab('duedate')}
        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="w-12 h-12 bg-pink-50 rounded-lg flex items-center justify-center text-pink-600 mb-4">
          <Baby size={24} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Pregnancy</h3>
        <p className="text-slate-500 text-sm">Calculate EDD & Trimesters.</p>
      </div>
      <div 
        onClick={() => setTab('urinetest')}
        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center text-yellow-600 mb-4">
          <FlaskConical size={24} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Urine Lab</h3>
        <p className="text-slate-500 text-sm">Dipstick & HCG Test analysis.</p>
      </div>
      <div 
        onClick={() => setTab('transport')}
        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 mb-4">
          <Truck size={24} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Transport</h3>
        <p className="text-slate-500 text-sm">Book Ambulances & Transport.</p>
      </div>
       <div 
        onClick={() => setTab('skin')}
        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 mb-4">
          <Hand size={24} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Skin Check</h3>
        <p className="text-slate-500 text-sm">Identify rashes & lesions.</p>
      </div>
      <div 
        onClick={() => setTab('xray')}
        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 mb-4">
          <ScanLine size={24} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">X-Ray Scan</h3>
        <p className="text-slate-500 text-sm">Fracture & bone analysis.</p>
      </div>
    </div>

    {/* Developer Bio-Data Section */}
    <div className="pt-8 pb-4">
      <div className="relative flex py-5 items-center">
        <div className="flex-grow border-t border-slate-300"></div>
        <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-semibold uppercase tracking-wider">About the Developer</span>
        <div className="flex-grow border-t border-slate-300"></div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="flex-shrink-0">
          <img 
            src="https://i.imghippo.com/files/gsw6351NQ.jpg" 
            alt="Shiv Shankar Yadav" 
            className="w-32 h-40 object-cover rounded-lg shadow-md border-4 border-white ring-1 ring-slate-200"
          />
        </div>
        <div className="flex-grow text-center md:text-left space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Shiv Shankar Yadav</h2>
          <div className="inline-block bg-medical-50 text-medical-700 px-3 py-1 rounded-full text-xs font-semibold border border-medical-100 mb-2">
            Software Developer & Medical Lab Technician
          </div>
          <div className="space-y-1 text-slate-600 text-sm">
            <p className="flex items-center justify-center md:justify-start">
              <span className="font-semibold w-24 text-slate-800">Education:</span> 
              Software Developer / Medical Laboratory Technician
            </p>
            <p className="flex items-center justify-center md:justify-start">
              <span className="font-semibold w-24 text-slate-800">Contact:</span> 
              +977 9820273464
            </p>
            <p className="flex items-center justify-center md:justify-start">
              <span className="font-semibold w-24 text-slate-800">Mission:</span> 
              Bridging technology and healthcare in Nepal.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const EmergencyView: React.FC = () => (
  <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
    <div className="text-center space-y-2">
      <h2 className="text-3xl font-bold text-red-600">Emergency Contacts</h2>
      <p className="text-slate-500">Important numbers for Nepal. Tap to call.</p>
    </div>

    <div className="grid gap-4">
      <a href="tel:100" className="flex items-center p-6 bg-white border border-slate-200 rounded-xl hover:border-red-200 hover:shadow-md transition-all group">
        <div className="bg-red-100 p-3 rounded-full text-red-600 mr-4 group-hover:scale-110 transition-transform">
          <Phone size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">Police Control</h3>
          <p className="text-slate-500">100</p>
        </div>
      </a>
      
      <a href="tel:102" className="flex items-center p-6 bg-white border border-slate-200 rounded-xl hover:border-red-200 hover:shadow-md transition-all group">
        <div className="bg-red-100 p-3 rounded-full text-red-600 mr-4 group-hover:scale-110 transition-transform">
          <Phone size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">Ambulance Service</h3>
          <p className="text-slate-500">102</p>
        </div>
      </a>

      <div className="p-6 bg-amber-50 rounded-xl border border-amber-100 mt-4">
        <h3 className="font-bold text-amber-800 mb-2">Poison Information</h3>
        <p className="text-amber-700 text-sm mb-1">Teaching Hospital (TUTH): 01-4412303</p>
        <p className="text-amber-700 text-sm">Patan Hospital: 01-5522295</p>
      </div>
    </div>
  </div>
);

// --- Main App Component ---

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('home');

  const renderContent = () => {
    switch (currentTab) {
      case 'calculator':
        return <DoseCalculator />;
      case 'duedate':
        return <DueDateCalculator />;
      case 'analyzer':
        return <BloodGroupAnalyzer />;
      case 'urinetest':
        return <UrineAnalyzer />;
      case 'skin':
        return <SkinAnalyzer />;
      case 'xray':
        return <XrayAnalyzer />;
      case 'transport':
        return <TransportBooking />;
      case 'compatibility':
        return <CompatibilityChart />;
      case 'emergency':
        return <EmergencyView />;
      default:
        return <HomeView setTab={setCurrentTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 relative overflow-hidden">
      {/* Background Rain Animation */}
      <MedicalRain />

      <Navbar currentTab={currentTab} setTab={setCurrentTab} />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {renderContent()}
      </main>

      {/* Disclaimer Banner */}
      <div className="bg-amber-50 border-t border-amber-100 p-4 relative z-10">
        <div className="max-w-7xl mx-auto text-xs text-amber-800 text-center leading-relaxed flex items-center justify-center">
           <ShieldCheck size={14} className="mr-2 flex-shrink-0" />
           {DISCLAIMER_TEXT}
        </div>
      </div>

      <footer className="bg-white border-t border-slate-200 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} QuickMed Nepal. Educational Use Only.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
