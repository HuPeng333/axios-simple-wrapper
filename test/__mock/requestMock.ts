import {appendParam} from "../../src/util/paramUtils";
import axios from "axios";
import {RequestRejectError} from "../../src/interceptor/debounce";


export const TEST_URL = 'http://localhost'

export const mockAjax = (params: Record<string, string>, expectedException: Function = RequestRejectError) => {
  return runAjaxPromise(axios.get(getUrl(params)), expectedException)
}

export const runAjaxPromise = (ajax: Promise<unknown>, expectedException: Function = RequestRejectError): Promise<boolean> => new Promise<boolean>(resolve => {
  ajax.then(() => resolve(true))
    .catch(e => resolve(!(e instanceof expectedException)))
})

export const getUrl = (params?: Record<string, string>):string => {
  if (!params) {
    return TEST_URL
  }
  let url = TEST_URL
  Object.keys(params).forEach(key => {
    url = appendParam(url, key, params[key])
  })
  return url
}
