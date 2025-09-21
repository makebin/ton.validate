import { parseRule } from './parser'
import { RuleFunction, RuleResult, RuleContext } from '../types/rule'
import { BuiltinRuleMap, BuiltinRuleName, builtinRules } from '../rules/index'

type CustomRuleMap<T extends string> = {
  [K in T]: RuleFunction
}

/**
 * 支持内置规则和自定义规则
 * @param value 待校验的值
 * @param ruleList 校验规则名数组，既可以是内置规则，也可以是自定义规则
 * @param customRules 自定义规则集合
 * @param ctx 上下文信息（如字段名）
 */
export async function check<T extends string>(
  value: any,
  ruleList: (BuiltinRuleName | T)[],
  customRules: CustomRuleMap<T> = {} as CustomRuleMap<T>,
  ctx: RuleContext = {}
): Promise<RuleResult> {
  // allRules 类型为内置规则 + 自定义规则
  const allRules: BuiltinRuleMap & CustomRuleMap<T> = { ...builtinRules, ...customRules }
  for (const r of ruleList) {
    const { name, args } = parseRule(r)
    const fn = allRules[name as BuiltinRuleName | T]
    if (!fn) throw new Error(`未知规则: ${name}`)

    const res = await Promise.resolve(fn(value, args, ctx))
    if (res !== true) {
      return { valid: false, rule: name, message: res }
    }
  }

  return { valid: true, rule: null, message: '' }
}
