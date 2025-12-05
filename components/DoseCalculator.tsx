import React, { useState, useEffect } from 'react';
import { MEDICINES } from '../constants';
import { DoseResult, Medicine } from '../types';
import { Info, AlertTriangle, FileText, Copy, Check } from 'lucide-react';

const DoseCalculator: React.FC = () => {
  const [weight, setWeight] = useState<number>(15);
  const [selectedMedId, setSelectedMedId] = useState<string>(MEDICINES[0].id);
  const [concentrationMg, setConcentrationMg] = useState<number>(120);
  const [concentrationVol, setConcentrationVol] = useState<number>(5);
  const [result, setResult] = useState<DoseResult | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedMed = MEDICINES.find(m => m.id === selectedMedId) || MEDICINES[0];

  // Update local concentration state when med changes
  useEffect(() => {
    setConcentrationMg(selectedMed.defaultConcentrationMg);
    setConcentrationVol(selectedMed.defaultVolumeMl);
  }, [selectedMed]);

  useEffect(() => {
    const calculate = () => {
      const doseMin = weight * selectedMed.perKgMin;
      const doseMax = weight * selectedMed.perKgMax;

      // Volume = (TargetDose / ConcentrationMg) * ConcentrationVol
      const volMin = (doseMin / concentrationMg) * concentrationVol;
      const volMax = (doseMax / concentrationMg) * concentrationVol;

      const safe = doseMax <= selectedMed.maxDailyDoseMg; // Basic safety check against adult absolute max

      setResult({
        singleDoseMgMin: Math.round(doseMin),
        singleDoseMgMax: Math.round(doseMax),
        volumeMlMin: Number(volMin.toFixed(1)),
        volumeMlMax: Number(volMax.toFixed(1)),
        maxDailyDose: selectedMed.maxDailyDoseMg,
        safe,
        warning: !safe ? "Calculated dose exceeds general maximum limits. Consult a doctor." : undefined
      });
    };

    calculate();
  }, [weight, selectedMed, concentrationMg, concentrationVol]);

  const handleCopy = () => {
    if (!result) return;
    const text = `QuickMed Dose Report:\nPatient Weight: ${weight}kg\nMedicine: ${selectedMed.name} (${concentrationMg}mg/${concentrationVol}ml)\nSafe Dose: ${result.volumeMlMin}ml - ${result.volumeMlMax}ml (${result.singleDoseMgMin}-${result.singleDoseMgMax}mg)\nFrequency: Every ${selectedMed.frequencyHours} hours.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Syrup Dose Calculator</h2>
        <p className="text-slate-500">Safe pediatric and adult dosing guidelines based on weight.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Weight Input */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700">
                Patient Weight
              </label>
              <div className="relative flex items-center">
                <input
                  type="range"
                  min="2"
                  max="100"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medical-600"
                />
              </div>
              <div className="flex justify-between items-center">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-24 p-2 text-center text-xl font-bold text-medical-700 border rounded-lg focus:ring-2 focus:ring-medical-500 outline-none"
                />
                <span className="text-slate-500 font-medium">kg</span>
              </div>
            </div>

            {/* Medicine Select */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700">Select Medicine</label>
              <select
                value={selectedMedId}
                onChange={(e) => setSelectedMedId(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-medical-500 outline-none"
              >
                {MEDICINES.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                 <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Syrup Concentration (Check Bottle)</label>
                 <div className="flex items-center space-x-2">
                    <input 
                      type="number" 
                      value={concentrationMg}
                      onChange={(e) => setConcentrationMg(Number(e.target.value))}
                      className="w-20 p-1 text-sm border rounded text-center"
                    />
                    <span className="text-sm text-slate-600">mg /</span>
                    <input 
                      type="number" 
                      value={concentrationVol}
                      onChange={(e) => setConcentrationVol(Number(e.target.value))}
                      className="w-12 p-1 text-sm border rounded text-center"
                    />
                    <span className="text-sm text-slate-600">ml</span>
                 </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Results Display */}
          {result && (
            <div className={`relative overflow-hidden rounded-xl p-6 transition-all duration-500 ${result.safe ? 'bg-medical-50 border border-medical-100' : 'bg-red-50 border border-red-100'}`}>
              <div className="flex flex-col items-center text-center space-y-2">
                <span className="text-sm font-semibold text-medical-600 tracking-wide uppercase">Recommended Single Dose</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-5xl font-bold text-slate-900 tracking-tight">
                    {result.volumeMlMin} - {result.volumeMlMax}
                  </span>
                  <span className="text-xl font-medium text-slate-500">mL</span>
                </div>
                <p className="text-slate-600 font-medium">
                  ({result.singleDoseMgMin}mg - {result.singleDoseMgMax}mg)
                </p>
                <div className="inline-flex items-center space-x-1 bg-white px-3 py-1 rounded-full text-xs font-medium text-slate-500 shadow-sm">
                  <span>Max 4 times per 24h</span>
                  <span>•</span>
                  <span>Min 4-6h interval</span>
                </div>
              </div>

              {result.warning && (
                 <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-start text-sm">
                   <AlertTriangle size={16} className="mt-0.5 mr-2 flex-shrink-0" />
                   {result.warning}
                 </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <a href={selectedMed.link} target="_blank" rel="noreferrer" className="flex items-center text-xs text-medical-600 hover:underline">
              <Info size={14} className="mr-1" /> Source: {selectedMed.citation}
            </a>
            <button 
              onClick={handleCopy}
              className="flex items-center text-sm font-medium text-slate-600 hover:text-medical-600 transition-colors"
            >
              {copied ? <Check size={16} className="mr-1 text-green-500" /> : <Copy size={16} className="mr-1" />}
              {copied ? "Copied" : "Copy Result"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoseCalculator;
