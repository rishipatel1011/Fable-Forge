
export interface Chapter {
  id: string;
  title: string;
  content: string;
  imagePrompt: string;
  imageUrl?: string;
  audioData?: string;
}

export interface Story {
  id: string;
  title: string;
  summary: string;
  chapters: Chapter[];
  createdAt: number;
  genre: string;
}

export enum StoryStatus {
  IDLE = 'IDLE',
  GENERATING_TEXT = 'GENERATING_TEXT',
  GENERATING_IMAGES = 'GENERATING_IMAGES',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export enum Page {
  FORGE = 'FORGE',
  LIBRARY = 'LIBRARY',
  EXPLORE = 'EXPLORE',
  SETTINGS = 'SETTINGS'
}

export interface GenerationParams {
  prompt: string;
  genre: string;
  tone: string;
}
