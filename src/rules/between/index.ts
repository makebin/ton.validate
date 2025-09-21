import messages from './messages'
import { RuleFunction } from '../../types/rule'

const between: RuleFunction = (val, min: string, max: string) => {
  const n = Number(val)
  const minNum = Number(min)
  const maxNum = Number(max)
  return (n >= minNum && n <= maxNum) || messages.between(minNum, maxNum)
}

export default between
