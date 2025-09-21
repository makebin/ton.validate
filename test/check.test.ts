import { check } from '../src/core/engine'
import { RuleFunction } from '../src/types/rule/index'
import { BuiltinRuleName } from '../src/rules/index'

// 异步自定义规则示例
const asyncUnique: RuleFunction = async (val, _args, ctx) => {
  await new Promise(res => setTimeout(res, 100)) // 模拟接口延迟
  return val !== 'admin' || `${ctx.field || '值'} 已被占用`
}

// 同步自定义规则示例
const startsWithA: RuleFunction = (val, _args, ctx) => {
  return String(val).startsWith('A') || `${ctx.field || '值'} 必须以 A 开头`
}

async function runTests() {
  console.log('--- 内置规则 required ---')
  console.log(await check('', ['required'], {}, { field: '用户名' }))
  // => { valid: false, rule: 'required', message: '用户名不能为空' }

  console.log(await check('Alice', ['required'], {}, { field: '用户名' }))
  // => { valid: true, rule: null, message: '' }

  console.log('--- 内置规则 between ---')
  console.log(await check('20', ['between(1,50)'], {}, { field: '年龄' }))
  // => { valid: true, rule: null, message: '' }

  console.log(await check('100', ['between(1,50)'], {}, { field: '年龄' }))
  // => { valid: false, rule: 'between', message: '年龄必须在 1 和 50 之间' }

  console.log('--- 异步自定义规则 ---')
  console.log(await check('admin', ['asyncUnique'], { asyncUnique }, { field: '昵称' }))
  // => { valid: false, rule: 'asyncUnique', message: '昵称 已被占用' }

  console.log(await check('Alice', ['asyncUnique'], { asyncUnique }, { field: '昵称' }))
  // => { valid: true, rule: null, message: '' }

  console.log('--- 同步自定义规则 ---')
  console.log(await check('Bob', ['startsWithA'], { startsWithA }, { field: '名字' }))
  // => { valid: false, rule: 'startsWithA', message: '名字 必须以 A 开头' }

  console.log(await check('Alice', ['startsWithA'], { startsWithA }, { field: '名字' }))
  // => { valid: true, rule: null, message: '' }
}

runTests()
