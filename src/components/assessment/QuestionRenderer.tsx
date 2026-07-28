'use client';

import type { Question } from '@/types';
import Image from 'next/image';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface QuestionRendererProps {
  question: Question;
  answer: string | string[] | undefined;
  onAnswer: (answer: string | string[]) => void;
  questionNumber: number;
  totalQuestions: number;
}

const QUESTION_TYPE_LABELS: Record<string, string> = {
  multiple_choice: 'Multiple Choice',
  image_identification: 'Image Identification',
  probe_simulation: 'Probe Simulation',
  charting: 'Charting',
  free_text: 'Free Text',
};

const LOCATION_OPTIONS = [
  { value: 'mesial', label: 'Mesial' },
  { value: 'distal', label: 'Distal' },
  { value: 'buccal', label: 'Buccal' },
  { value: 'lingual', label: 'Lingual' },
];

export function QuestionRenderer({ question, answer, onAnswer, questionNumber: _questionNumber, totalQuestions: _totalQuestions }: QuestionRendererProps) {
  const selectedAnswer = typeof answer === 'string' ? answer : undefined;

  const renderInput = () => {
    switch (question.type) {
      case 'multiple_choice':
      case 'image_identification':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <button
                key={option.id}
                onClick={() => onAnswer(option.id)}
                className={`w-full rounded-lg border p-4 text-left transition-all ${
                  selectedAnswer === option.id
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="text-sm font-medium text-gray-900">{option.text}</span>
              </button>
            ))}
          </div>
        );

      case 'probe_simulation':
        return (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Depth (mm)
              </label>
              <Input
                type="number"
                min="0"
                max="12"
                step="0.5"
                value={typeof answer === 'string' ? answer.split(':')[0] ?? '' : ''}
                onChange={(e) => {
                  const location = typeof answer === 'string' ? answer.split(':')[1] ?? '' : '';
                  onAnswer(`${e.target.value}:${location}`);
                }}
                placeholder="Enter probing depth"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Location
              </label>
              <Select
                options={LOCATION_OPTIONS}
                placeholder="Select location"
                value={typeof answer === 'string' ? answer.split(':')[1] ?? '' : ''}
                onChange={(e) => {
                  const depth = typeof answer === 'string' ? answer.split(':')[0] ?? '' : '';
                  onAnswer(`${depth}:${e.target.value}`);
                }}
              />
            </div>
          </div>
        );

      case 'charting':
      case 'free_text':
        return (
          <textarea
            className="min-h-[120px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            value={selectedAnswer ?? ''}
            onChange={(e) => onAnswer(e.target.value)}
            placeholder={
              question.type === 'charting'
                ? 'Enter your dental charting notes...'
                : 'Enter your answer...'
            }
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
          {QUESTION_TYPE_LABELS[question.type] ?? question.type}
        </span>
        <span className="text-sm font-medium text-gray-500">
          {question.points} point{question.points !== 1 ? 's' : ''}
        </span>
      </div>

      {question.type === 'image_identification' && (
        <div className="mb-4">
          {question.imageUrl ? (
            <Image
              src={question.imageUrl}
              alt="Question image"
              width={512}
              height={256}
              unoptimized
              className="max-h-64 w-full rounded-lg object-contain"
            />
          ) : (
            <div className="flex h-48 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
              Image not available
            </div>
          )}
        </div>
      )}

      <p className="mb-6 text-base text-gray-900">{question.content}</p>

      {renderInput()}
    </div>
  );
}
