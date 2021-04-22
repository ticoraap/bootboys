export function DockApi(httpClient) {
    function get(id) {
        return httpClient.getDock(id);
    }

    function getAll() {
        return httpClient.getAllDocks();
    }

    function getAllOwned() {
        return httpClient.getAllDocks();
    }

    function add(id, dock) {
        return httpClient.addDock(id, dock);
    }

    function remove(id) {
        return httpClient.removeDock(id);
    }

    return Object.freeze({ get, getAll, getAllOwned, add, remove });
}
