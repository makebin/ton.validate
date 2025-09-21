import messages from './messages'
import { RuleFunction } from '../../types/rule'

const required: RuleFunction = (val) => {
  return (val != null && String(val).trim() !== '') || messages.required
}

export default required
