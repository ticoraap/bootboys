import httpClient from "./httpClient";
import { AddressApi } from "./Adress";
import { DockApi } from "./Dock";
import { UserApi } from "./User";

export const Api = {
    dock: DockApi(httpClient),
    address: AddressApi(httpClient),
    user: UserApi(httpClient),
};
