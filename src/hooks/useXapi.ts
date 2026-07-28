'use client';

import { useCallback } from 'react';
import { useUserStore } from '@/stores';
import type { XAPIStatement, XAPIVerb } from '@/types';

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
    // Phase 4: Send to LRS endpoint
    console.warn('xAPI Statement:', statement);
    return { success: true, statementId: statement.id };
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
