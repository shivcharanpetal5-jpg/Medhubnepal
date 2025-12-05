
import React, { useState } from 'react';
import { MapPin, Navigation, Zap, Phone, Clock, CheckCircle } from 'lucide-react';

const TransportBooking: React.FC = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<'basic' | 'oxygen' | 'icu' | null>(null);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'searching' | 'confirmed'>('idle');

  const vehicles = [
    {
      id: 'basic',
      name: 'Basic Ambulance',
      price: 'Rs. 1,500',
      time: '5-8 min',
      features: 'Stretcher, First Aid',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      icon: '🚑'
    },
    {
      id: 'oxygen',
      name: 'Oxygen Support',
      price: 'Rs. 2,500',
      time: '10-12 min',
      features: 'Oxygen Cylinder, Nurse',
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      icon: '🌬️'
    },
    {
      id: 'icu',
      name: 'ICU / Ventilator',
      price: 'Rs. 5,000+',
      time: '15-20 min',
      features: 'Ventilator, Doctor, ICU',
      color: 'bg-red-50 border-red-200 text-red-700',
      icon: '🏥'
    }
  ];

  const handleBook = () => {
    if (!pickup || !destination || !selectedVehicle) return;
    setBookingStatus('searching');
    setTimeout(() => {
      setBookingStatus('confirmed');
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-20">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Medical Transport</h2>
        <p className="text-slate-500">Fast ambulance booking & hospital transfer.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Map Placeholder */}
        <div className="relative h-64 md:h-auto bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner group">
          <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Kathmandu_OpenStreetMap.png')] bg-cover bg-center"></div>
          
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="relative">
               <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping absolute"></div>
               <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
             </div>
          </div>
          
          {bookingStatus === 'confirmed' && (
             <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-xl shadow-lg border border-green-100 animate-fade-in">
                <div className="flex items-center space-x-3">
                   <div className="bg-green-100 p-2 rounded-full text-green-600">
                     <CheckCircle size={20} />
                   </div>
                   <div>
                     <p className="font-bold text-slate-800">Driver Assigned</p>
                     <p className="text-xs text-slate-500">Arriving in 6 mins • Bagmati Ba 2 Pa 1234</p>
                   </div>
                </div>
             </div>
          )}
        </div>

        {/* Booking Form */}
        <div className="space-y-6 bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          
          <div className="space-y-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Pickup Location (e.g. Thamel, Kathmandu)" 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-500 outline-none"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
              />
            </div>
            <div className="relative">
              <Navigation className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Destination Hospital" 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-500 outline-none"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Select Vehicle Type</h3>
            <div className="space-y-3">
              {vehicles.map((v) => (
                <div 
                  key={v.id}
                  onClick={() => setSelectedVehicle(v.id as any)}
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedVehicle === v.id ? 'border-medical-500 bg-medical-50' : 'border-slate-100 hover:border-slate-200'}`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{v.icon}</span>
                      <div>
                        <h4 className="font-bold text-slate-800">{v.name}</h4>
                        <p className="text-xs text-slate-500">{v.features}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{v.price}</p>
                      <p className="text-xs text-slate-500 flex items-center justify-end">
                        <Clock size={10} className="mr-1" /> {v.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleBook}
            disabled={!pickup || !destination || !selectedVehicle || bookingStatus !== 'idle'}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center space-x-2 transition-all ${
              bookingStatus === 'idle' 
              ? 'bg-slate-900 text-white hover:bg-slate-800' 
              : bookingStatus === 'confirmed' 
                ? 'bg-green-600 text-white'
                : 'bg-slate-300 text-slate-500 cursor-wait'
            }`}
          >
             {bookingStatus === 'idle' && (
               <>
                 <Zap size={20} className="text-yellow-400" />
                 <span>Request Ambulance</span>
               </>
             )}
             {bookingStatus === 'searching' && <span>Finding nearest driver...</span>}
             {bookingStatus === 'confirmed' && <span>Ride Confirmed!</span>}
          </button>

          <p className="text-xs text-center text-slate-400">
            *Estimated prices. Payment directly to driver.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransportBooking;
