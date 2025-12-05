import React, { useState } from 'react';
import { Calendar, Baby, Heart } from 'lucide-react';

const DueDateCalculator: React.FC = () => {
  const [lmp, setLmp] = useState<string>('');
  const [result, setResult] = useState<{
    dueDate: string;
    weeksPregnant: number;
    trimester: string;
    daysLeft: number;
  } | null>(null);

  const calculateDueDate = () => {
    if (!lmp) return;

    const lmpDate = new Date(lmp);
    const today = new Date();

    // Naegele's Rule: Add 280 days (40 weeks) to LMP
    const dueDate = new Date(lmpDate);
    dueDate.setDate(lmpDate.getDate() + 280);

    // Calculate Weeks Pregnant
    const diffTime = Math.abs(today.getTime() - lmpDate.getTime());
    const weeksPregnant = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));

    // Calculate Trimester
    let trimester = 'First Trimester';
    if (weeksPregnant >= 13 && weeksPregnant <= 26) {
      trimester = 'Second Trimester';
    } else if (weeksPregnant >= 27) {
      trimester = 'Third Trimester';
    }

    // Days left
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    setResult({
      dueDate: dueDate.toDateString(),
      weeksPregnant: weeksPregnant > 42 ? 42 : weeksPregnant, // Cap at 42 just for display safety
      trimester,
      daysLeft: diffDays > 0 ? diffDays : 0,
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Pregnancy Calculator</h2>
        <p className="text-slate-500">Calculate estimated delivery date (EDD) based on LMP.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden p-6 sm:p-8 space-y-6">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            First Day of Last Menstrual Period (LMP)
          </label>
          <div className="relative">
            <input
              type="date"
              value={lmp}
              onChange={(e) => setLmp(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-medical-500 outline-none"
            />
            <Calendar className="absolute right-3 top-3 text-slate-400" size={20} />
          </div>
          
          <button
            onClick={calculateDueDate}
            className="w-full py-3 bg-medical-600 text-white rounded-lg font-bold shadow-md hover:bg-medical-700 transition-all"
          >
            Calculate Due Date
          </button>
        </div>

        {result && (
          <div className="bg-medical-50 border border-medical-100 rounded-xl p-6 space-y-6 animate-fade-in">
            <div className="text-center">
              <span className="text-xs font-bold text-medical-600 uppercase tracking-wider">Estimated Due Date</span>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{result.dueDate}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
                <Baby className="text-pink-500 mb-2" size={24} />
                <span className="text-2xl font-bold text-slate-800">{result.weeksPregnant}</span>
                <span className="text-xs text-slate-500 font-medium">Weeks Pregnant</span>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
                <Heart className="text-red-500 mb-2" size={24} />
                <span className="text-sm font-bold text-slate-800 text-center mt-1">{result.trimester}</span>
                <span className="text-xs text-slate-500 font-medium mt-1">{result.daysLeft} Days to go</span>
              </div>
            </div>
            
            <p className="text-xs text-center text-slate-500 italic mt-2">
              *Calculations are estimates based on a 280-day cycle. Consult a Gynecologist for accurate dating scans.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DueDateCalculator;