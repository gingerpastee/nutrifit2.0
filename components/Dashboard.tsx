import React, { useEffect, useState } from 'react';
import { User, DietPlan, Exercise } from '../types';
import { geminiService } from '../services/geminiService';
import { storageService } from '../services/storageService';
import { Button } from './Button';
import { Plus, Droplets, Flame, Utensils, PlayCircle } from 'lucide-react';

interface DashboardProps {
  user: User;
  onUpdateUser: (u: User) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onUpdateUser }) => {
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [loadingDiet, setLoadingDiet] = useState(false);
  const [activeTab, setActiveTab] = useState<'diet' | 'workout'>('diet');
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    // Load exercises
    const allExercises = storageService.getExercises();
    // Filter simple suggestion based on level
    const userLevel = user.profile?.level || 'Beginner';
    setExercises(allExercises.filter(e => e.level === userLevel));
  }, [user.profile?.level]);

  const generateDiet = async () => {
    if (!user.profile) return;
    setLoadingDiet(true);
    try {
      const plan = await geminiService.generateDietPlan(user.profile);
      setDietPlan(plan);
      // Update calories/protein targets based on plan
      const updatedUser = { 
        ...user, 
        dailyCalories: plan.totalCalories, 
        dailyProtein: plan.totalProtein 
      };
      storageService.saveUser(updatedUser);
      onUpdateUser(updatedUser);
    } catch (e) {
      alert("Failed to generate diet plan. Please try again later.");
    } finally {
      setLoadingDiet(false);
    }
  };

  const addWater = () => {
    const updatedUser = { ...user, waterIntake: (user.waterIntake || 0) + 1 };
    storageService.saveUser(updatedUser);
    onUpdateUser(updatedUser);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Water Intake</p>
            <div className="flex items-end space-x-2">
              <h3 className="text-2xl font-bold text-gray-800">{user.waterIntake || 0} <span className="text-sm font-normal text-gray-400">glasses</span></h3>
              <button onClick={addWater} className="text-blue-600 hover:text-blue-800 pb-1"><Plus className="w-5 h-5" /></button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
           <div className="p-3 bg-orange-100 rounded-lg text-orange-600">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Target Calories</p>
            <h3 className="text-2xl font-bold text-gray-800">{user.dailyCalories || 0} <span className="text-sm font-normal text-gray-400">kcal</span></h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
           <div className="p-3 bg-green-100 rounded-lg text-green-600">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Protein Target</p>
            <h3 className="text-2xl font-bold text-gray-800">{user.dailyProtein || 0} <span className="text-sm font-normal text-gray-400">g</span></h3>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="border-b flex">
          <button 
            onClick={() => setActiveTab('diet')}
            className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'diet' ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            AI Diet Plan
          </button>
          <button 
             onClick={() => setActiveTab('workout')}
             className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'workout' ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Workouts & Videos
          </button>
        </div>

        <div className="p-6 min-h-[400px]">
          {activeTab === 'diet' ? (
            <div className="space-y-6">
              {!dietPlan ? (
                <div className="text-center py-10">
                   <div className="mb-4 text-gray-400 mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                     <Utensils className="w-8 h-8" />
                   </div>
                   <h3 className="text-lg font-medium text-gray-900 mb-2">No Plan Generated Yet</h3>
                   <p className="text-gray-500 mb-6">Let our AI create a perfect {user.profile?.dietPreference} plan for you.</p>
                   <Button onClick={generateDiet} isLoading={loadingDiet}>Generate Daily Plan</Button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {Object.entries(dietPlan).map(([key, value]) => {
                    if (key === 'totalCalories' || key === 'totalProtein') return null;
                    const meal = value as any;
                    return (
                      <div key={key} className="border rounded-xl p-5 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                           <h4 className="capitalize font-bold text-lg text-brand-800">{key}</h4>
                           <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded text-gray-600">{meal.calories} kcal</span>
                        </div>
                        <h5 className="font-semibold text-gray-800 mb-1">{meal.name}</h5>
                        <p className="text-gray-600 text-sm mb-3">{meal.description}</p>
                        <div className="bg-gray-50 p-3 rounded-lg text-sm">
                           <span className="font-medium text-gray-700">Ingredients:</span> {meal.ingredients.join(', ')}
                        </div>
                      </div>
                    );
                  })}
                   <div className="col-span-full flex justify-center pt-4">
                     <Button variant="outline" onClick={generateDiet} isLoading={loadingDiet}>Regenerate Plan</Button>
                   </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
               <h3 className="text-xl font-bold text-gray-800 mb-4">Recommended Exercises ({user.profile?.level})</h3>
               <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                 {exercises.length === 0 ? (
                   <p className="text-gray-500 col-span-full text-center py-8">No exercises found for your level. Admin needs to add content.</p>
                 ) : (
                   exercises.map(ex => (
                     <div key={ex.id} className="border rounded-xl overflow-hidden hover:shadow-lg transition-all group">
                       <div className="aspect-video bg-black relative">
                          <iframe 
                            src={ex.videoUrl} 
                            title={ex.name} 
                            className="w-full h-full" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                          ></iframe>
                       </div>
                       <div className="p-4">
                         <div className="flex justify-between items-start">
                           <h4 className="font-bold text-gray-900">{ex.name}</h4>
                           <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">{ex.category}</span>
                         </div>
                         <p className="text-sm text-gray-500 mt-2">{ex.description}</p>
                       </div>
                     </div>
                   ))
                 )}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
