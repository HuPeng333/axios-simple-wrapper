import {getUrl, runAjaxPromise} from "./__mock/requestMock"
import {applyDebounceInterceptor, cancelOldAjax, noRepeatAjax} from "../src"
import axiosWrapper from "../src/index"
import axios from "axios";

axiosWrapper.default.axios = axios
applyDebounceInterceptor(axios)

test('Test noRepeatAjax', async () => {
  expect(await runAjaxPromise(noRepeatAjax(`${getUrl()}#removeRequest=false`))).toBe(true)
  expect(await runAjaxPromise(noRepeatAjax(`${getUrl()}#removeRequest=false`))).toBe(false)
})

test('Test cancelOldAjax', async () => {
  await runAjaxPromise(cancelOldAjax(`${getUrl()}#removeRequest=false`))
  expect(await runAjaxPromise(cancelOldAjax(`${getUrl()}#removeRequest=false`))).toBe(true)
})

