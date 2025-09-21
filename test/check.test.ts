import { check } from '../src'

async function runTests() {
  console.log(await check('', ['required']))
  console.log(await check('25', ['between(1,50)']))
  console.log(await check('100', ['between(1,50)']))
}

runTests()
