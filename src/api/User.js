export function UserApi(httpClient) {
    function addDock(dock) {
        return httpClient.addUserDock(dock);
    }

    function getDocks() {
        return httpClient.getUserDocks();
    }

    function removeDock(id) {
        return httpClient.removeUserDock(id);
    }

    return Object.freeze({ addDock, getDocks, removeDock });
}
