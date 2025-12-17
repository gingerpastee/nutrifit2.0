import React, { useState, useEffect } from 'react';
import { Post, User } from '../types';
import { COMMUNITIES } from '../constants';
import { storageService } from '../services/storageService';
import { geminiService } from '../services/geminiService';
import { Button } from './Button';
import { Input } from './Input';
import { MessageSquare, ThumbsUp, ShieldAlert, Send } from 'lucide-react';

interface CommunityProps {
  currentUser: User;
}

export const Community: React.FC<CommunityProps> = ({ currentUser }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeCommunity, setActiveCommunity] = useState<string>('All');
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    // Poll for posts (simulated real-time)
    const load = () => {
      const allPosts = storageService.getPosts();
      if (activeCommunity === 'All') {
        setPosts(allPosts);
      } else {
        setPosts(allPosts.filter(p => p.community === activeCommunity));
      }
    };
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [activeCommunity]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle || !newPostContent) return;
    setIsPosting(true);

    // AI Moderation
    const isSafe = await geminiService.checkContentSafety(`${newPostTitle} ${newPostContent}`);
    
    if (!isSafe) {
      alert("Your post contains violent or inappropriate content and has been blocked.");
      setIsPosting(false);
      return;
    }

    const newPost: Post = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      community: activeCommunity === 'All' ? COMMUNITIES[0] : activeCommunity,
      title: newPostTitle,
      content: newPostContent,
      upvotes: 0,
      timestamp: Date.now(),
      comments: []
    };

    storageService.addPost(newPost);
    setPosts([newPost, ...posts]);
    setShowPostModal(false);
    setNewPostTitle('');
    setNewPostContent('');
    setIsPosting(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-fade-in">
      {/* Sidebar - Communities */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white rounded-xl shadow-sm p-4 sticky top-4">
          <h3 className="font-bold text-gray-700 mb-4 px-2">Communities</h3>
          <ul className="space-y-1">
            <li>
              <button 
                onClick={() => setActiveCommunity('All')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${activeCommunity === 'All' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                All Feeds
              </button>
            </li>
            {COMMUNITIES.map(c => (
              <li key={c}>
                <button 
                  onClick={() => setActiveCommunity(c)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${activeCommunity === c ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {c}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Feed */}
      <div className="flex-1 space-y-4">
        <div className="bg-white p-4 rounded-xl shadow-sm flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
             {currentUser.name.charAt(0)}
          </div>
          <input 
            type="text" 
            placeholder="Create Post..." 
            className="flex-1 bg-gray-100 hover:bg-white border-transparent hover:border-gray-300 border rounded-lg px-4 py-2 transition-all cursor-pointer"
            onClick={() => setShowPostModal(true)}
            readOnly
          />
          <Button onClick={() => setShowPostModal(true)}><Send className="w-4 h-4" /></Button>
        </div>

        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:border-gray-300 transition-colors">
            <div className="flex">
              {/* Voting Column */}
              <div className="w-12 bg-gray-50 rounded-l-xl flex flex-col items-center py-4 space-y-1 border-r border-gray-100">
                <button className="text-gray-400 hover:text-brand-600"><ThumbsUp className="w-5 h-5" /></button>
                <span className="text-sm font-bold text-gray-700">{post.upvotes}</span>
              </div>
              
              {/* Content */}
              <div className="p-4 flex-1">
                 <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                   <span className="font-bold text-black">{post.community}</span>
                   <span>•</span>
                   <span>Posted by u/{post.userName}</span>
                   <span>•</span>
                   <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                 </div>
                 <h3 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h3>
                 <p className="text-gray-700 text-sm mb-4 leading-relaxed">{post.content}</p>
                 
                 <div className="flex items-center space-x-4 text-gray-500 text-sm">
                   <button className="flex items-center space-x-2 hover:bg-gray-100 px-2 py-1 rounded">
                     <MessageSquare className="w-4 h-4" />
                     <span>{post.comments.length} Comments</span>
                   </button>
                   <button className="flex items-center space-x-2 hover:bg-gray-100 px-2 py-1 rounded">
                     <ShieldAlert className="w-4 h-4" />
                     <span>Report</span>
                   </button>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 animate-fade-in-up">
            <h2 className="text-xl font-bold mb-4">Create a Post</h2>
            <form onSubmit={handleCreatePost} className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Community</label>
                 <select 
                    className="w-full border rounded-lg px-3 py-2"
                    value={activeCommunity === 'All' ? COMMUNITIES[0] : activeCommunity}
                    onChange={(e) => setActiveCommunity(e.target.value)}
                 >
                   {COMMUNITIES.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
               </div>
               <Input 
                 placeholder="Title" 
                 value={newPostTitle} 
                 onChange={e => setNewPostTitle(e.target.value)} 
                 autoFocus
               />
               <textarea 
                 className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[120px] focus:ring-2 focus:ring-brand-500 focus:outline-none"
                 placeholder="Text (optional)"
                 value={newPostContent}
                 onChange={e => setNewPostContent(e.target.value)}
               ></textarea>
               
               <div className="flex justify-end space-x-3 pt-2">
                 <Button type="button" variant="ghost" onClick={() => setShowPostModal(false)}>Cancel</Button>
                 <Button type="submit" isLoading={isPosting} disabled={!newPostTitle}>Post</Button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
