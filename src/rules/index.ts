import required from './required/index'
import between from './between/index'
import { RuleMap } from '../types/rule'
export const builtinRules = {
  required,
  between,
} as const

export type BuiltinRuleName = keyof typeof builtinRules

export type BuiltinRuleMap = {
  [K in BuiltinRuleName]: typeof builtinRules[K]
}

export default builtinRules