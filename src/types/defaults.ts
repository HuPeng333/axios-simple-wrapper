import {AxiosStatic} from "axios";

export type Defaults = {
  axios?: AxiosStatic
}

export type DefaultExportType = {
  default: Defaults
}
