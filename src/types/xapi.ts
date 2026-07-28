export interface XAPIActor {
  mbox: string;
  name: string;
  objectType: 'Agent';
}

export interface XAPIVerb {
  id: string;
  display: { [lang: string]: string };
}

export interface XAPIObject {
  id: string;
  definition: {
    name: { [lang: string]: string };
    description?: { [lang: string]: string };
    type?: string;
  };
}

export interface XAPIResult {
  score?: {
    scaled: number;
    raw: number;
    min: number;
    max: number;
  };
  success?: boolean;
  completion?: boolean;
  duration?: string; // ISO 8601 duration
  response?: string;
}

export interface XAPIContext {
  contextActivities?: {
    parent?: XAPIObject[];
    grouping?: XAPIObject[];
  };
  extensions?: { [key: string]: unknown };
}

export interface XAPIStatement {
  id?: string;
  actor: XAPIActor;
  verb: XAPIVerb;
  object: XAPIObject;
  result?: XAPIResult;
  context?: XAPIContext;
  timestamp: string | Date;
  authority?: XAPIActor;
}

// Predefined verbs
export const XAPI_VERBS = {
  ATTEMPTED: { id: 'http://adlnet.gov/expapi/verbs/attempted', display: { 'en-US': 'attempted' } },
  COMPLETED: { id: 'http://adlnet.gov/expapi/verbs/completed', display: { 'en-US': 'completed' } },
  PASSED: { id: 'http://adlnet.gov/expapi/verbs/passed', display: { 'en-US': 'passed' } },
  FAILED: { id: 'http://adlnet.gov/expapi/verbs/failed', display: { 'en-US': 'failed' } },
  ANSWERED: { id: 'http://adlnet.gov/expapi/verbs/answered', display: { 'en-US': 'answered' } },
  PROBED: { id: 'http://activitystrea.ms/explore/verbs/probed', display: { 'en-US': 'probed' } },
  MEASURED: { id: 'http://activitystrea.ms/explore/verbs/measured', display: { 'en-US': 'measured' } },
  DIAGNOSED: { id: 'http://activitystrea.ms/explore/verbs/diagnosed', display: { 'en-US': 'diagnosed' } },
} as const;
