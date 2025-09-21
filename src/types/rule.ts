export interface RuleContext {
  field?: string  // 字段名称，比如 "用户名"
}

export type RuleResultValue = true | string | Promise<true | string>

export interface RuleFunction {
  (val: any, args: string[], ctx: RuleContext): RuleResultValue
}

export interface RuleResult {
  valid: boolean
  rule: string | null
  message: string
}

export type RuleMap = Record<string, RuleFunction>
