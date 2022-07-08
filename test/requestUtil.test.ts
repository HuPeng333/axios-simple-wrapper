import {parseObjToPostParam} from "../src/util/requestUtils";

test('Test parseObjToPostParam', () => {
  expect(parseObjToPostParam({
    page: 1,
    size: 10
  })).toBe('page=1&size=10')
  expect(parseObjToPostParam({
    text: 'test?',
  })).toBe('text=test%3F')
})
