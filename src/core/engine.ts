import { parseRule } from './parser'
import { RuleFunction, RuleResult } from '../types/rule'
import * as builtinRules from '../rules/index'

export async function check(
  value: any,
  ruleList: string[],
  customRules: Record<string, RuleFunction> = {}
): Promise<RuleResult> {
  const allRules = { ...builtinRules, ...customRules }

  for (const r of ruleList) {
    const { name, args } = parseRule(r)
    const fn = allRules[name]
    if (!fn) throw new Error(`未知规则: ${name}`)

    // ⭐️ 统一处理同步/异步
    const res = await Promise.resolve(fn(value, ...args))

    if (res !== true) {
      return { valid: false, rule: name, message: res }
    }
  }

  return { valid: true, rule: null, message: '' }
}
