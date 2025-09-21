import required from './required/index'
import between from './between/index'
import { RuleMap } from '../types/rule'
const builtinRules: RuleMap = {
  required,
  between,
}
export default builtinRules