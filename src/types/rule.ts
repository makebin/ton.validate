export type RuleResultValue = true | string | Promise<true | string>

export type RuleFunction = (val: any, ...args: any[]) => RuleResultValue

export interface RuleResult {
  valid: boolean
  rule: string | null
  message: string
}
