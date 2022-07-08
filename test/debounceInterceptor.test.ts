import axios from "axios"
import {applyDebounceInterceptor} from "../src"
import {RejectPolicy, RequestRejectError} from "../src/interceptor/debounce";
import {mockAjax} from "./__mock/requestMock";

class Err extends RequestRejectError{}

applyDebounceInterceptor(axios, {rejectErrorClass: Err})
/**
 * 拒绝策略测试
 * @param policy 要使用的策略
 * @param remove 是否要移除请求记录
 * @return {boolean} 请求是否成功
 */
const rejectPolicyTest = (policy: RejectPolicy, remove: boolean):Promise<boolean> => {
  return mockAjax({rejectPolicy: policy, removeRequest: String(remove)}, Err)
}

test(`'rejectIfExist' policy test`,  async () => {
  // 正常先后发送两个请求, 应该都成功
  expect(await rejectPolicyTest('rejectIfExist', true)).toBe(true)
  expect(await rejectPolicyTest('rejectIfExist', true)).toBe(true)
  // 同时发送两个请求, 只成功第一个
  expect(await rejectPolicyTest('rejectIfExist', false)).toBe(true)
  expect(await rejectPolicyTest('rejectIfExist', false)).toBe(false)
})

test(`'cancelOld' policy test`, async () => {
  // 正常先后发送两个请求, 应该都成功
  expect(await rejectPolicyTest('cancelOldTask', true)).toBe(true)
  expect(await rejectPolicyTest('cancelOldTask', true)).toBe(true)
  // 同时发送两个请求, 只最后一个成功, 这个策略不是很好测试, 毕竟不能保持发送中的状态
  // 这里先发送一个请求, 但不消除记录
  rejectPolicyTest('cancelOldTask', false);
  expect(await rejectPolicyTest('cancelOldTask', true)).toBe(true)
})

// 不测试noPolicy策略
