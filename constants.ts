import { Exercise, Level, Post } from './types';

export const ADMIN_EMAIL = 'koushikmreddy43@gmail.com';

export const COMMUNITIES = [
  'r/GeneralFitness',
  'r/MuscleGain',
  'r/WeightLoss',
  'r/Yoga',
  'r/Running',
  'r/HealthyEating'
];

export const DEFAULT_EXERCISES: Exercise[] = [
  {
    id: 'ex1',
    name: 'Push Ups',
    description: 'Standard push up for chest and triceps.',
    videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
    level: Level.BEGINNER,
    category: 'Strength'
  },
  {
    id: 'ex2',
    name: 'Squats',
    description: 'Bodyweight squats for legs.',
    videoUrl: 'https://www.youtube.com/embed/aclHkVaku9U',
    level: Level.BEGINNER,
    category: 'Strength'
  },
  {
    id: 'ex3',
    name: 'Burpees',
    description: 'Full body cardio.',
    videoUrl: 'https://www.youtube.com/embed/dZgVxmf6jkA',
    level: Level.INTERMEDIATE,
    category: 'Cardio'
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'u2',
    userName: 'GymRat99',
    community: 'r/MuscleGain',
    title: 'Finally hit my bench press PR!',
    content: 'After 6 months of consistent training, I finally pushed 100kg. Consistency is key guys!',
    upvotes: 245,
    timestamp: Date.now() - 10000000,
    comments: []
  },
  {
    id: 'p2',
    userId: 'u3',
    userName: 'SarahRunner',
    community: 'r/Running',
    title: 'Best running shoes for flat feet?',
    content: 'I need advice. My arches hurt after 5k.',
    upvotes: 42,
    timestamp: Date.now() - 5000000,
    comments: []
  }
];
