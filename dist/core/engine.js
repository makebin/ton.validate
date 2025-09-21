import { parseRule } from './parser';
import * as builtinRules from '../rules/index';
export async function check(value, ruleList, customRules = {}) {
    const allRules = Object.assign(Object.assign({}, builtinRules), customRules);
    for (const r of ruleList) {
        const { name, args } = parseRule(r);
        const fn = allRules[name];
        if (!fn)
            throw new Error(`δ֪����: ${name}`);
        // �8�2�1�5 ͳһ����ͬ��/�첽
        const res = await Promise.resolve(fn(value, ...args));
        if (res !== true) {
            return { valid: false, rule: name, message: res };
        }
    }
    return { valid: true, rule: null, message: '' };
}
