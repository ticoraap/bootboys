import httpService from "../shared/httpService";
import { getAddressApi } from "./Adress";
import { getDockApi } from "./Dock";
import { getUserApi } from "./User";

export const Api = {
    dock: getDockApi(httpService),
    address: getAddressApi(httpService),
    user: getUserApi(httpService)
};

