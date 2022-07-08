import {getUrl, runAjaxPromise} from "./__mock/requestMock"
import {applyDebounceInterceptor, cancelOldAjax, noRepeatAjax} from "../src"
import axiosWrapper from "../src/index"
import axios, {AxiosError} from "axios";

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

test('Test request param', () => {
  try {
    noRepeatAjax('https://localhost', {
      page: 1,
      size: 10
    }, 'POST')
  } catch (e) {
    const err = e as AxiosError
    expect(err.config.data).toBe(encodeURIComponent('page=1&size=10'))
  }
})
