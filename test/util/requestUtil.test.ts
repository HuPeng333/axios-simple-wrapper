import {parseObjToPostParam} from "../../src/util/requestUtils";

test('test param', () => {
  const param = parseObjToPostParam({a: 1, b: 0, c: 'abc', d: undefined})
  expect(param).toBe('a=1&b=0&c=abc')
})
