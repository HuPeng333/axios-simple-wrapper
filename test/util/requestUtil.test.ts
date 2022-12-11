import {parseObjToPostParam} from "../../src/util/requestUtils";

test('test param', () => {
  const param = parseObjToPostParam({a: 1, b: undefined, c: 'abc', d: null})
  expect(param).toBe('a=1&c=abc')
})
