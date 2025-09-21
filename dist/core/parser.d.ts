export interface ParsedRule {
    name: string;
    args: string[];
}
export declare function parseRule(ruleStr: string): ParsedRule;
