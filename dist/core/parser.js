export function parseRule(ruleStr) {
    const match = ruleStr.match(/^([a-zA-Z0-9_]+)(?:\((.*)\))?$/);
    if (!match)
        return { name: ruleStr, args: [] };
    const [, name, argsStr] = match;
    const args = argsStr ? argsStr.split(',').map(s => s.trim()) : [];
    return { name, args };
}
