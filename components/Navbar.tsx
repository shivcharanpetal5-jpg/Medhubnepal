
import React from 'react';
import { TabType } from '../types';
import { Activity, Calculator, Microscope, HeartHandshake, AlertCircle, Menu, X, Baby, Truck, FlaskConical, ScanLine, Hand } from 'lucide-react';

interface NavbarProps {
  currentTab: TabType;
  setTab: (tab: TabType) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentTab, setTab }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Activity size={18} /> },
    { id: 'calculator', label: 'Dose', icon: <Calculator size={18} /> },
    { id: 'duedate', label: 'Pregnancy', icon: <Baby size={18} /> },
    { id: 'urinetest', label: 'Urine', icon: <FlaskConical size={18} /> },
    { id: 'skin', label: 'Skin', icon: <Hand size={18} /> },
    { id: 'xray', label: 'X-Ray', icon: <ScanLine size={18} /> },
    { id: 'analyzer', label: 'Blood', icon: <Microscope size={18} /> },
    { id: 'transport', label: 'Transport', icon: <Truck size={18} /> },
    { id: 'compatibility', label: 'Matrix', icon: <HeartHandshake size={18} /> },
    { id: 'emergency', label: 'Emergency', icon: <AlertCircle size={18} /> },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setTab('home')}>
            <div className="bg-medical-600 text-white p-2 rounded-lg mr-2">
              <Activity size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 leading-none">QuickMed</h1>
              <span className="text-xs text-slate-500 font-medium">NEPAL</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-1 items-center overflow-x-auto no-scrollbar">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`flex items-center px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                  currentTab === item.id
                    ? 'bg-medical-50 text-medical-700 ring-1 ring-medical-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 absolute w-full z-50 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 max-h-[80vh] overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setTab(item.id);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center px-3 py-3 rounded-md text-base font-medium ${
                  currentTab === item.id
                    ? 'bg-medical-50 text-medical-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
