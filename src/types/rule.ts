export type RuleResultValue = true | string | Promise<true | string>

export interface RuleFunction {
  (val: any, ...args: any[]): RuleResultValue
}

export interface RuleResult {
  valid: boolean
  rule: string | null
  message: string
}

// ���򼯺�����
export type RuleMap = Record<string, RuleFunction>
