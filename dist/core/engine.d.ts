import { RuleFunction, RuleResult } from '../types/rule';
export declare function check(value: any, ruleList: string[], customRules?: Record<string, RuleFunction>): Promise<RuleResult>;
