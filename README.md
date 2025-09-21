# ton.validate 验证库使用说明

## 1. 安装

```bash
npm install ton.validate
```

## 2. 引入

```ts
import { check, builtinRules, RuleFunction } from 'check-lib'
```

## 3. 内置规则

- `required`：必填项
- `between(min,max)`：数值范围
- 更多规则可查看 `rules/` 文件夹

## 4. 基本使用

### 4.1 校验单个值

```ts
const result = await check('Alice', ['required'], {}, { field: '用户名' })
console.log(result)
// 输出: { valid: true, rule: null, message: '' }
```

```ts
const result2 = await check('', ['required'], {}, { field: '用户名' })
console.log(result2)
// 输出: { valid: false, rule: 'required', message: '用户名不能为空' }
```

### 4.2 带参数规则

```ts
const result = await check('100', ['between(1,50)'], {}, { field: '年龄' })
console.log(result)
// 输出: { valid: false, rule: 'between', message: '年龄必须在 1 和 50 之间' }
```

## 5. 自定义规则

```ts
const startsWithA: RuleFunction = (val, _args, ctx) => {
  return String(val).startsWith('A') || `${ctx.field || '值'} 必须以 A 开头`
}

const result = await check('Bob', ['startsWithA'], { startsWithA }, { field: '名字' })
console.log(result)
// 输出: { valid: false, rule: 'startsWithA', message: '名字 必须以 A 开头' }
```

### 5.1 异步自定义规则

```ts
const asyncUnique: RuleFunction = async (val, _args, ctx) => {
  await new Promise(res => setTimeout(res, 100))
  return val !== 'admin' || `${ctx.field || '值'} 已被占用`
}

const result = await check('admin', ['asyncUnique'], { asyncUnique }, { field: '昵称' })
console.log(result)
// 输出: { valid: false, rule: 'asyncUnique', message: '昵称 已被占用' }
```

## 6. ctx.field 用法

- `ctx.field` 用于生成友好提示信息
- 如果不传 `field`，默认使用通用提示

```ts
const result = await check('', ['required'])
console.log(result)
// 输出: { valid: false, rule: 'required', message: '必填项不能为空' }
```

## 7. 内置规则扩展

- 规则函数必须实现 `RuleFunction` 接口
- 返回值 `true | string | Promise<true|string>`
- 可以放到 `rules/` 文件夹，并在 `rules/index.ts` 导出

## 8. 异步规则支持

- 引擎会自动 `await` 返回 `Promise` 的规则
- 可以和同步规则混合使用