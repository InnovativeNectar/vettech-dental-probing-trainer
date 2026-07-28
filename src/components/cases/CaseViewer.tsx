'use client';

import type { ClinicalCase } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface CaseViewerProps {
  caseData: ClinicalCase;
  onStartAssessment?: () => void;
}

const SEVERITY_STYLES: Record<string, string> = {
  mild: 'bg-green-100 text-green-700',
  moderate: 'bg-yellow-100 text-yellow-700',
  severe: 'bg-red-100 text-red-700',
};

export function CaseViewer({ caseData, onStartAssessment }: CaseViewerProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{caseData.title}</h1>
          <p className="mt-1 text-sm text-gray-500">{caseData.description}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${SEVERITY_STYLES[caseData.severity]}`}>
          {caseData.severity}
        </span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Patient Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="font-medium text-gray-500">Species</dt>
              <dd className="mt-1 capitalize text-gray-900">{caseData.species}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Breed</dt>
              <dd className="mt-1 text-gray-900">{caseData.breed}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Age</dt>
              <dd className="mt-1 text-gray-900">{caseData.ageYears} years</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Presenting Complaint</dt>
              <dd className="mt-1 text-gray-900">{caseData.presentingComplaint}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pathology Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Badge variant="outline">{caseData.pathologyType.replace(/_/g, ' ')}</Badge>
            <Badge variant="secondary">{caseData.difficulty}</Badge>
            <span className="text-gray-500">{caseData.estimatedMinutes} min estimated</span>
            <span className="text-gray-500">{caseData.affectedTeeth.length} affected teeth</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Probe Findings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
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
                {caseData.probeFindings.map((finding) => (
                  <tr key={finding.toothNumber} className="text-gray-700">
                    <td className="whitespace-nowrap px-3 py-2 font-medium">{finding.toothNumber}</td>
                    <td className="px-3 py-2">{finding.locations.mesial ?? '\u2014'}</td>
                    <td className="px-3 py-2">{finding.locations.distal ?? '\u2014'}</td>
                    <td className="px-3 py-2">{finding.locations.buccal ?? '\u2014'}</td>
                    <td className="px-3 py-2">{finding.locations.lingual ?? '\u2014'}</td>
                    <td className="px-3 py-2">
                      {finding.bleedingOnProbing ? (
                        <span className="text-red-600">Yes</span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>
                    <td className="px-3 py-2">{finding.mobility}</td>
                    <td className="px-3 py-2">{finding.furcation ?? '\u2014'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Diagnosis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">{caseData.diagnosis}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Treatment Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">{caseData.treatmentPlan}</p>
        </CardContent>
      </Card>

      {caseData.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {caseData.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      )}

      {onStartAssessment && (
        <div className="flex justify-end">
          <Button size="lg" onClick={onStartAssessment}>
            Begin Assessment
          </Button>
        </div>
      )}
    </div>
  );
}
