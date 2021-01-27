import httpService from "../shared/httpService";
import { getAddressApi } from "./Adress";
import { getDockApi } from "./Dock";

export const Api = {
    dock: getDockApi(httpService),
    address: getAddressApi(httpService)
};

