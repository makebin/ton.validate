import { parseRule } from './parser'
import { RuleMap, RuleResult } from '../types/rule'
import builtinRules from '../rules/index'

export async function check(
  value: any,
  ruleList: string[],
  customRules: RuleMap = {}
): Promise<RuleResult> {
  // ⭐️ allRules 是 RuleMap 类型（保证 value 必然是 RuleFunction）
  const allRules: RuleMap = { ...builtinRules, ...customRules }

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
