export type AssessmentType = 'quiz' | 'practical' | 'clinical' | 'comprehensive';

export type QuestionType = 'multiple_choice' | 'image_identification' | 'probe_simulation' | 'charting' | 'free_text';

export interface Assessment {
  id: string;
  title: string;
  description: string;
  type: AssessmentType;
  moduleId?: string; // null for comprehensive
  timeLimitMinutes: number;
  passingScore: number; // percentage
  questions: Question[];
  maxAttempts: number;
}

export interface Question {
  id: string;
  type: QuestionType;
  content: string;
  imageUrl?: string;
  modelUrl?: string; // for 3D simulation questions
  options?: AnswerOption[];
  correctAnswer: string | string[];
  points: number;
  explanation: string;
}

export interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface AssessmentAttempt {
  id: string;
  assessmentId: string;
  userId: string;
  answers: Answer[];
  score: number;
  passed: boolean;
  timeSpentSeconds: number;
  startedAt: Date;
  completedAt: Date;
}

export interface Answer {
  questionId: string;
  userAnswer: string | string[];
  isCorrect: boolean;
  pointsEarned: number;
}

export interface AssessmentResult {
  attempt: AssessmentAttempt;
  assessment: Assessment;
  feedback: FeedbackItem[];
}

export interface FeedbackItem {
  questionId: string;
  isCorrect: boolean;
  explanation: string;
  correctAnswer: string;
}
