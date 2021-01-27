export function getDockApi(httpClient) {
    function getAll() {
        return httpClient.getAllDocks()
    }

    function getAllOwned() {
        return httpClient.getAllDocks()
    }
    
    function add(dock) {
        return httpClient.addDock(dock);
    }

    function remove(dockid) {
        return httpClient.removeDock(dockid);
    }

    return Object.freeze({ getAll, getAllOwned, add, remove });
}
