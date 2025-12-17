import { User, Post, Exercise, ChatMessage, UserRole } from '../types';
import { DEFAULT_EXERCISES, MOCK_POSTS, ADMIN_EMAIL } from '../constants';

const KEYS = {
  USERS: 'nutrifit_users',
  CURRENT_USER: 'nutrifit_current_user',
  POSTS: 'nutrifit_posts',
  EXERCISES: 'nutrifit_exercises',
  MESSAGES: 'nutrifit_messages'
};

export const storageService = {
  // Users
  getUsers: (): User[] => {
    const users = localStorage.getItem(KEYS.USERS);
    return users ? JSON.parse(users) : [];
  },

  saveUser: (user: User) => {
    const users = storageService.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    
    // Update current user if it's the one being saved
    const currentUser = storageService.getCurrentUser();
    if (currentUser && currentUser.id === user.id) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    }
  },

  login: (email: string, password: string): User | null => {
    // Admin Backdoor
    if (email === ADMIN_EMAIL && password === 'admin123') {
      const adminUser: User = {
        id: 'admin',
        name: 'Admin Koushik',
        email: email,
        role: UserRole.ADMIN,
        waterIntake: 0,
        dailyCalories: 0,
        dailyProtein: 0
      };
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(adminUser));
      return adminUser;
    }

    const users = storageService.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
      return user;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(KEYS.CURRENT_USER);
  },

  getCurrentUser: (): User | null => {
    const u = localStorage.getItem(KEYS.CURRENT_USER);
    return u ? JSON.parse(u) : null;
  },

  // Posts
  getPosts: (): Post[] => {
    const p = localStorage.getItem(KEYS.POSTS);
    return p ? JSON.parse(p) : MOCK_POSTS;
  },

  addPost: (post: Post) => {
    const posts = storageService.getPosts();
    posts.unshift(post);
    localStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
  },

  // Exercises
  getExercises: (): Exercise[] => {
    const e = localStorage.getItem(KEYS.EXERCISES);
    return e ? JSON.parse(e) : DEFAULT_EXERCISES;
  },

  addExercise: (exercise: Exercise) => {
    const exercises = storageService.getExercises();
    exercises.push(exercise);
    localStorage.setItem(KEYS.EXERCISES, JSON.stringify(exercises));
  },

  // Messages (Private)
  getMessages: (): ChatMessage[] => {
    const m = localStorage.getItem(KEYS.MESSAGES);
    return m ? JSON.parse(m) : [];
  },

  sendMessage: (msg: ChatMessage) => {
    const msgs = storageService.getMessages();
    msgs.push(msg);
    localStorage.setItem(KEYS.MESSAGES, JSON.stringify(msgs));
  }
};
