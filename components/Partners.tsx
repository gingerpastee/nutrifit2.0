import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { storageService } from '../services/storageService';
import { MapPin, UserPlus } from 'lucide-react';
import { Button } from './Button';

interface PartnersProps {
  currentUser: User;
}

export const Partners: React.FC<PartnersProps> = ({ currentUser }) => {
  const [nearbyUsers, setNearbyUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate finding users
    const users = storageService.getUsers().filter(u => u.id !== currentUser.id);
    
    // In a real app, calculate geo-distance. Here we mock it or just show random users.
    // For demo, we just show all other registered users.
    setTimeout(() => {
      setNearbyUsers(users);
      setLoading(false);
    }, 1000);
  }, [currentUser.id]);

  const requestLocation = () => {
    if (navigator.geolocation) {
       alert("Simulating location search... (Accessing Lat/Long)");
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="bg-gradient-to-r from-brand-600 to-teal-500 rounded-xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-2">Find Your FitFam</h2>
        <p className="opacity-90 mb-6">Connect with gym partners, running buddies, and yoga enthusiasts near you.</p>
        <Button variant="secondary" onClick={requestLocation}>
          <MapPin className="w-4 h-4 mr-2" /> Enable Location
        </Button>
      </div>

      <h3 className="text-xl font-bold text-gray-800">Suggested Partners</h3>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        </div>
      ) : nearbyUsers.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No partners found nearby yet. Invite your friends!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nearbyUsers.map(user => (
            <div key={user.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-gray-200 mb-4 flex items-center justify-center text-xl font-bold text-gray-500">
                {user.name.charAt(0)}
              </div>
              <h4 className="font-bold text-lg text-gray-900">{user.name}</h4>
              <p className="text-brand-600 text-sm mb-2">{user.profile?.goal || 'Fitness Enthusiast'}</p>
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                 <span className="text-xs bg-gray-100 px-2 py-1 rounded">{user.profile?.level}</span>
                 {user.profile?.dietPreference && <span className="text-xs bg-gray-100 px-2 py-1 rounded">{user.profile.dietPreference}</span>}
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <UserPlus className="w-4 h-4 mr-2" /> Connect
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
