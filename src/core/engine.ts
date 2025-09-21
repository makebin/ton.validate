import { parseRule } from './parser'
import { RuleMap, RuleResult } from '../types/rule'
import builtinRules from '../rules/index'

export async function check(
  value: any,
  ruleList: string[],
  customRules: RuleMap = {}
): Promise<RuleResult> {
  const allRules: RuleMap = { ...builtinRules, ...customRules }

  for (const r of ruleList) {
    const { name, args } = parseRule(r)
    const fn = allRules[name]
    if (!fn) throw new Error(`${name}`)
    
    const res = await Promise.resolve(fn(value, ...args))

    if (res !== true) {
      return { valid: false, rule: name, message:res as string }
    }
  }

  return { valid: true, rule: null, message: '' }
}
