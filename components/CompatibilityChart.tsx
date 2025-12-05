import React from 'react';
import { COMPATIBILITY_MATRIX } from '../constants';
import { Check, X } from 'lucide-react';

const CompatibilityChart: React.FC = () => {
  const bloodTypes = Object.keys(COMPATIBILITY_MATRIX);

  const isCompatible = (donor: string, recipient: string) => {
    // @ts-ignore
    return COMPATIBILITY_MATRIX[recipient].receiveFrom.includes(donor);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Donor Compatibility</h2>
        <p className="text-slate-500">Who can give blood to whom? (Green = Safe)</p>
      </div>

      <div className="bg-white p-2 sm:p-6 rounded-2xl shadow-lg border border-slate-200 overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr>
              <th className="p-3 text-left text-slate-400 font-medium">
                <div className="flex flex-col">
                  <span className="text-xs uppercase">Recipient</span>
                  <span className="text-2xl font-bold text-slate-800">↓</span>
                </div>
              </th>
              {bloodTypes.map(type => (
                <th key={type} className="p-3 text-center">
                  <div className="bg-slate-100 rounded-lg py-2 px-1 text-slate-700 font-bold">
                    {type}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 font-normal">Donor</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bloodTypes.map(recipient => (
              <tr key={recipient}>
                <th className="p-3">
                  <div className="bg-medical-600 text-white rounded-lg py-2 px-3 font-bold shadow-sm">
                    {recipient}
                  </div>
                </th>
                {bloodTypes.map(donor => {
                  const safe = isCompatible(donor, recipient);
                  return (
                    <td key={`${donor}-${recipient}`} className="p-1">
                      <div className={`h-12 w-full rounded-md flex items-center justify-center transition-all duration-300 ${safe ? 'bg-green-100 text-green-600' : 'bg-slate-50 text-slate-200'}`}>
                        {safe ? <Check size={20} strokeWidth={3} /> : <X size={16} />}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <h3 className="font-bold text-blue-900 mb-2">Universal Donor (O-)</h3>
          <p className="text-sm text-blue-800">O-Negative blood can be given to almost anyone in an emergency because it lacks A, B, and Rh antigens.</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
          <h3 className="font-bold text-purple-900 mb-2">Universal Recipient (AB+)</h3>
          <p className="text-sm text-purple-800">AB-Positive patients can receive red blood cells from all blood types.</p>
        </div>
        <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
          <h3 className="font-bold text-amber-900 mb-2">Rh Factor</h3>
          <p className="text-sm text-amber-800">Rh-negative patients should generally only receive Rh-negative blood to avoid sensitization.</p>
        </div>
      </div>
    </div>
  );
};

export default CompatibilityChart;
