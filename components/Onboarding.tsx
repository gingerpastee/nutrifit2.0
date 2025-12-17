import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { User, UserProfile, Goal, Level, DietPreference } from '../types';
import { storageService } from '../services/storageService';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface OnboardingProps {
  user: User;
  onComplete: (user: User) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    age: 25,
    gender: 'Male',
    height: 170,
    weight: 70,
    allergies: [],
    dietPreference: DietPreference.STANDARD,
    level: Level.BEGINNER,
    goal: Goal.MAINTENANCE
  });
  const [allergyInput, setAllergyInput] = useState('');

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleComplete = () => {
    const updatedUser = { ...user, profile };
    storageService.saveUser(updatedUser);
    onComplete(updatedUser);
  };

  const addAllergy = () => {
    if (allergyInput.trim()) {
      setProfile(p => ({ ...p, allergies: [...p.allergies, allergyInput.trim()] }));
      setAllergyInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Step {step} of 4</span>
            <span className="text-xs font-semibold text-brand-600">{Math.round((step / 4) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div className="h-2 bg-brand-500 rounded-full transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }}></div>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800">Basic Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Age" type="number" value={profile.age} onChange={e => setProfile({...profile, age: parseInt(e.target.value)})} />
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500"
                  value={profile.gender}
                  onChange={e => setProfile({...profile, gender: e.target.value as any})}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <Input label="Height (cm)" type="number" value={profile.height} onChange={e => setProfile({...profile, height: parseInt(e.target.value)})} />
              <Input label="Weight (kg)" type="number" value={profile.weight} onChange={e => setProfile({...profile, weight: parseInt(e.target.value)})} />
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={handleNext}>Next <ChevronRight className="ml-2 w-4 h-4" /></Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800">Your Goals & Experience</h2>
            
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Fitness Goal</label>
              <div className="grid grid-cols-2 gap-3">
                {Object.values(Goal).map(g => (
                  <button
                    key={g}
                    onClick={() => setProfile({...profile, goal: g})}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${profile.goal === g ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="font-semibold">{g}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Experience Level</label>
              <div className="flex space-x-4">
                {Object.values(Level).map(l => (
                  <button
                    key={l}
                    onClick={() => setProfile({...profile, level: l})}
                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${profile.level === l ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack}><ChevronLeft className="mr-2 w-4 h-4" /> Back</Button>
              <Button onClick={handleNext}>Next <ChevronRight className="ml-2 w-4 h-4" /></Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800">Diet Preferences</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Diet Style</label>
              <select 
                className="w-full px-3 py-3 border border-gray-300 rounded-lg text-lg"
                value={profile.dietPreference}
                onChange={e => setProfile({...profile, dietPreference: e.target.value as DietPreference})}
              >
                {Object.values(DietPreference).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Food Allergies</label>
               <div className="flex space-x-2 mb-3">
                 <Input 
                  placeholder="e.g. Peanuts, Shellfish" 
                  value={allergyInput} 
                  onChange={e => setAllergyInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addAllergy()}
                 />
                 <Button onClick={addAllergy}>Add</Button>
               </div>
               <div className="flex flex-wrap gap-2">
                 {profile.allergies.map(a => (
                   <span key={a} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center">
                     {a}
                     <button 
                      onClick={() => setProfile(p => ({...p, allergies: p.allergies.filter(x => x !== a)}))}
                      className="ml-2 hover:text-red-900"
                     >
                       ×
                     </button>
                   </span>
                 ))}
               </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack}><ChevronLeft className="mr-2 w-4 h-4" /> Back</Button>
              <Button onClick={handleNext}>Next <ChevronRight className="ml-2 w-4 h-4" /></Button>
            </div>
          </div>
        )}
        
        {step === 4 && (
             <div className="space-y-6 animate-fade-in text-center">
               <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                 <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
               </div>
               <h2 className="text-2xl font-bold text-gray-800">You're All Set!</h2>
               <p className="text-gray-600">We've customized NutriFit based on your profile. Get ready to transform.</p>
               
               <div className="flex justify-center pt-8 space-x-4">
                  <Button variant="outline" onClick={handleBack}>Review</Button>
                  <Button size="lg" onClick={handleComplete}>Let's Go!</Button>
               </div>
             </div>
        )}
      </div>
    </div>
  );
};
