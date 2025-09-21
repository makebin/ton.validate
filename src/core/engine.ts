import { parseRule } from './parser'
import { RuleMap, RuleResult } from '../types/rule'
import builtinRules from '../rules/index'

export async function check(
  value: any,
  ruleList: string[],
  customRules: RuleMap = {}
): Promise<RuleResult> {
  // �8�2�1�5 allRules �� RuleMap ���ͣ���֤ value ��Ȼ�� RuleFunction��
  const allRules: RuleMap = { ...builtinRules, ...customRules }

  for (const r of ruleList) {
    const { name, args } = parseRule(r)
    const fn = allRules[name]
    if (!fn) throw new Error(`δ֪����: ${name}`)
    
    // �8�2�1�5 ͳһ����ͬ��/�첽
    const res = await Promise.resolve(fn(value, ...args))

    if (res !== true) {
      return { valid: false, rule: name, message: res }
    }
  }

  return { valid: true, rule: null, message: '' }
}
