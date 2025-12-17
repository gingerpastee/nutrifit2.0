export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum Goal {
  MUSCLE_GAIN = 'Muscle Gain',
  FAT_LOSS = 'Fat Loss',
  MAINTENANCE = 'Maintenance',
  ENDURANCE = 'Endurance'
}

export enum Level {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export enum DietPreference {
  NORTH_INDIAN = 'North Indian',
  SOUTH_INDIAN = 'South Indian',
  VEGAN = 'Vegan',
  KETO = 'Keto',
  PALEO = 'Paleo',
  STANDARD = 'Standard Balanced'
}

export interface UserProfile {
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  height: number; // cm
  weight: number; // kg
  allergies: string[];
  dietPreference: DietPreference;
  level: Level;
  goal: Goal;
  location?: string; // For partner finding
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // In real app, hash this. Mocking here.
  role: UserRole;
  profile?: UserProfile;
  waterIntake: number; // glasses today
  dailyCalories: number;
  dailyProtein: number;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  videoUrl: string; // YouTube embed or similar
  level: Level;
  category: 'Strength' | 'Cardio' | 'Flexibility';
}

export interface DietMeal {
  name: string;
  description: string;
  calories: number;
  protein: number;
  ingredients: string[];
}

export interface DietPlan {
  breakfast: DietMeal;
  lunch: DietMeal;
  snack: DietMeal;
  dinner: DietMeal;
  totalCalories: number;
  totalProtein: number;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  community: string; // e.g., r/GymBros, r/HealthyEating
  title: string;
  content: string;
  imageUrl?: string;
  upvotes: number;
  timestamp: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
}
