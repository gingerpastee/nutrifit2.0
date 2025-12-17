import React, { useState } from 'react';
import { Exercise, Level } from '../types';
import { storageService } from '../services/storageService';
import { Button } from './Button';
import { Input } from './Input';
import { Trash2 } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>(storageService.getExercises());
  const [newEx, setNewEx] = useState<Partial<Exercise>>({
    name: '',
    description: '',
    videoUrl: '',
    level: Level.BEGINNER,
    category: 'Strength'
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEx.name || !newEx.videoUrl) return;

    const exercise: Exercise = {
      id: Date.now().toString(),
      name: newEx.name!,
      description: newEx.description || '',
      videoUrl: newEx.videoUrl!,
      level: newEx.level as Level,
      category: newEx.category as any
    };

    storageService.addExercise(exercise);
    setExercises([...exercises, exercise]);
    setNewEx({ ...newEx, name: '', description: '', videoUrl: '' });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gray-800 text-white p-6 rounded-xl">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-400">Manage exercise content and tutorials.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm h-fit">
          <h2 className="font-bold text-lg mb-4">Add New Exercise</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <Input label="Exercise Name" value={newEx.name} onChange={e => setNewEx({...newEx, name: e.target.value})} />
            <Input label="Description" value={newEx.description} onChange={e => setNewEx({...newEx, description: e.target.value})} />
            <Input label="Video URL (Embed Link)" placeholder="https://www.youtube.com/embed/..." value={newEx.videoUrl} onChange={e => setNewEx({...newEx, videoUrl: e.target.value})} />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select 
                className="w-full border rounded-lg px-3 py-2"
                value={newEx.level}
                onChange={e => setNewEx({...newEx, level: e.target.value as Level})}
              >
                {Object.values(Level).map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select 
                className="w-full border rounded-lg px-3 py-2"
                value={newEx.category}
                onChange={e => setNewEx({...newEx, category: e.target.value as any})}
              >
                <option>Strength</option>
                <option>Cardio</option>
                <option>Flexibility</option>
              </select>
            </div>

            <Button type="submit" className="w-full">Add Exercise</Button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
           <h2 className="font-bold text-lg mb-4">Exercise Library</h2>
           <div className="space-y-4">
             {exercises.map(ex => (
               <div key={ex.id} className="flex gap-4 border p-3 rounded-lg">
                 <div className="w-32 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    <iframe src={ex.videoUrl} className="w-full h-20 pointer-events-none" tabIndex={-1} />
                 </div>
                 <div className="flex-1">
                   <h4 className="font-bold">{ex.name}</h4>
                   <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 mr-2">{ex.level}</span>
                   <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{ex.category}</span>
                   <p className="text-sm text-gray-500 mt-1 truncate">{ex.description}</p>
                 </div>
                 <button className="text-red-500 hover:text-red-700 p-2">
                   <Trash2 className="w-5 h-5" />
                 </button>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};
