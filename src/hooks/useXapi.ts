'use client';

import { useCallback } from 'react';
import { useUserStore } from '@/stores';
import type { XAPIStatement, XAPIVerb } from '@/types';

const LRS_ENDPOINT = process.env.NEXT_PUBLIC_LRS_ENDPOINT || '';
const LRS_AUTH = process.env.NEXT_PUBLIC_LRS_AUTH || '';
const LRS_ENABLED = process.env.NEXT_PUBLIC_LRS_ENABLED === 'true';

function generateId(): string {
  return `urn:uuid:${crypto.randomUUID()}`;
}

export function useXapi() {
  const { user } = useUserStore();

  const createStatement = useCallback(
    (verb: XAPIVerb, objectId: string, objectName: string, result?: Partial<XAPIStatement['result']>): XAPIStatement => {
      return {
        id: generateId(),
        actor: {
          mbox: user?.id ? `mailto:${user.id}@example.com` : 'mailto:anonymous@example.com',
          name: user?.name || 'Anonymous',
          objectType: 'Agent' as const,
        },
        verb,
        object: {
          id: `urn:vettech:module:${objectId}`,
          definition: { name: { 'en-US': objectName } },
        },
        result,
        timestamp: new Date(),
      };
    },
    [user]
  );

  const sendStatement = useCallback(async (statement: XAPIStatement) => {
    if (!LRS_ENABLED || !LRS_ENDPOINT) {
      console.warn('xAPI LRS not configured — statement logged locally:', statement.id);
      return { success: true, statementId: statement.id, localOnly: true };
    }

    try {
      const response = await fetch(`${LRS_ENDPOINT}/statements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': LRS_AUTH ? `Basic ${LRS_AUTH}` : '',
          'X-Experience-API-Version': '1.0.3',
        },
        body: JSON.stringify({
          ...statement,
          timestamp: statement.timestamp instanceof Date ? statement.timestamp.toISOString() : statement.timestamp,
          result: statement.result ? {
            ...statement.result,
            score: statement.result.score ? {
              ...statement.result.score,
              scaled: statement.result.score.scaled,
            } : undefined,
          } : undefined,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error('xAPI LRS error:', response.status, err);
        return { success: false, error: err, status: response.status };
      }

      const data = await response.json();
      return { success: true, statementId: statement.id, lrsResponse: data };
    } catch (err) {
      console.error('xAPI LRS network error:', err);
      return { success: false, error: String(err), localOnly: true };
    }
  }, []);

  const trackProbingAction = useCallback(
    async (toothNumber: number, depthMm: number, accuracy: number) => {
      const statement = createStatement(
        { id: 'attempted', display: { 'en-US': 'attempted' } },
        `probe:${toothNumber}`,
        `Probing tooth ${toothNumber}`,
        { score: { raw: accuracy, min: 0, max: 1, scaled: accuracy }, success: accuracy > 0.8 }
      );
      return sendStatement(statement);
    },
    [createStatement, sendStatement]
  );

  const trackModuleCompletion = useCallback(
    async (moduleId: string, moduleName: string, score: number, passed: boolean) => {
      const statement = createStatement(
        { id: 'completed', display: { 'en-US': 'completed' } },
        `module:${moduleId}`,
        moduleName,
        { score: { raw: score, min: 0, max: 100, scaled: score / 100 }, success: passed, completion: true }
      );
      return sendStatement(statement);
    },
    [createStatement, sendStatement]
  );

  return { createStatement, sendStatement, trackProbingAction, trackModuleCompletion };
}
