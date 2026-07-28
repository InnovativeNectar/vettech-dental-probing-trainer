'use client';

import { useState } from 'react';
import type { ClinicalCase, CaseAttempt } from '@/types';
import { useCaseStore } from '@/stores';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface CaseAssessmentProps {
  caseData: ClinicalCase;
  onComplete: (result: CaseAttempt) => void;
}

function scoreAnswer(userAnswer: string, correctAnswer: string): number {
  const keywords = correctAnswer
    .toLowerCase()
    .split(/[\s,;.]+/)
    .filter((w) => w.length > 3);
  if (keywords.length === 0) return 1;
  const userLower = userAnswer.toLowerCase();
  const matches = keywords.filter((kw) => userLower.includes(kw)).length;
  return matches / keywords.length;
}

export function CaseAssessment({ caseData, onComplete }: CaseAssessmentProps) {
  const [diagnosis, setDiagnosis] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const setCurrentAttempt = useCaseStore((s) => s.setCurrentAttempt);

  const handleSubmit = () => {
    const diagScore = scoreAnswer(diagnosis, caseData.diagnosis);
    const treatScore = scoreAnswer(treatmentPlan, caseData.treatmentPlan);
    const totalScore = Math.round(((diagScore + treatScore) / 2) * 100);

    const attempt: CaseAttempt = {
      id: crypto.randomUUID(),
      caseId: caseData.id,
      userId: '',
      probeReadings: caseData.probeFindings,
      diagnosis,
      treatmentPlan,
      score: totalScore,
      completedAt: new Date(),
    };

    setScore(totalScore);
    setSubmitted(true);
    setCurrentAttempt(attempt);
    onComplete(attempt);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Case Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-500">Patient</span>
              <p className="capitalize text-gray-900">{caseData.species} &mdash; {caseData.breed}, {caseData.ageYears}y</p>
            </div>
            <div>
              <span className="font-medium text-gray-500">Complaint</span>
              <p className="text-gray-900">{caseData.presentingComplaint}</p>
            </div>
          </div>

          <div>
            <span className="text-sm font-medium text-gray-500">Probe Findings</span>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-left text-xs font-medium uppercase text-gray-500">
                    <th className="px-3 py-2">Tooth</th>
                    <th className="px-3 py-2">Mesial</th>
                    <th className="px-3 py-2">Distal</th>
                    <th className="px-3 py-2">Buccal</th>
                    <th className="px-3 py-2">Lingual</th>
                    <th className="px-3 py-2">BOP</th>
                    <th className="px-3 py-2">Mobility</th>
                    <th className="px-3 py-2">Furcation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {caseData.probeFindings.map((f) => (
                    <tr key={f.toothNumber} className="text-gray-700">
                      <td className="whitespace-nowrap px-3 py-2 font-medium">{f.toothNumber}</td>
                      <td className="px-3 py-2">{f.locations.mesial ?? '\u2014'}</td>
                      <td className="px-3 py-2">{f.locations.distal ?? '\u2014'}</td>
                      <td className="px-3 py-2">{f.locations.buccal ?? '\u2014'}</td>
                      <td className="px-3 py-2">{f.locations.lingual ?? '\u2014'}</td>
                      <td className="px-3 py-2">{f.bleedingOnProbing ? <span className="text-red-600">Yes</span> : 'No'}</td>
                      <td className="px-3 py-2">{f.mobility}</td>
                      <td className="px-3 py-2">{f.furcation ?? '\u2014'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {!submitted ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="diagnosis" className="mb-1 block text-sm font-medium text-gray-700">
                Diagnosis
              </label>
              <textarea
                id="diagnosis"
                rows={4}
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your diagnosis based on the case findings..."
              />
            </div>
            <div>
              <label htmlFor="treatment" className="mb-1 block text-sm font-medium text-gray-700">
                Treatment Plan
              </label>
              <textarea
                id="treatment"
                rows={4}
                value={treatmentPlan}
                onChange={(e) => setTreatmentPlan(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Describe your treatment plan..."
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSubmit} disabled={!diagnosis.trim() || !treatmentPlan.trim()}>
                Submit Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Score:</span>
              <Badge variant={score >= 70 ? 'success' : 'destructive'} className="text-base">
                {score}%
              </Badge>
            </div>

            <div>
              <h4 className="mb-1 text-sm font-medium text-gray-700">Your Diagnosis</h4>
              <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">{diagnosis}</p>
            </div>
            <div>
              <h4 className="mb-1 text-sm font-medium text-gray-700">Correct Diagnosis</h4>
              <p className="rounded-lg bg-green-50 p-3 text-sm text-green-800">{caseData.diagnosis}</p>
            </div>

            <div>
              <h4 className="mb-1 text-sm font-medium text-gray-700">Your Treatment Plan</h4>
              <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">{treatmentPlan}</p>
            </div>
            <div>
              <h4 className="mb-1 text-sm font-medium text-gray-700">Correct Treatment Plan</h4>
              <p className="rounded-lg bg-green-50 p-3 text-sm text-green-800">{caseData.treatmentPlan}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
