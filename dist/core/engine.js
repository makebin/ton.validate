import { parseRule } from './parser';
import builtinRules from '../rules/index';
export async function check(value, ruleList, customRules = {}) {
    const allRules = Object.assign(Object.assign({}, builtinRules), customRules);
    for (const r of ruleList) {
        const { name, args } = parseRule(r);
        const fn = allRules[name];
        if (!fn)
            throw new Error(`${name}`);
        const res = await Promise.resolve(fn(value, ...args));
        if (res !== true) {
            return { valid: false, rule: name, message: res };
        }
    }
    return { valid: true, rule: null, message: '' };
}
