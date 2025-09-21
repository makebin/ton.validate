import { RuleMap, RuleResult } from '../types/rule';
export declare function check(value: any, ruleList: string[], customRules?: RuleMap): Promise<RuleResult>;
