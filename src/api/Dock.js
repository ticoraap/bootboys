export function getDockApi(httpService) {
    function get(dockid) {
        return httpService.getDock(dockid)
    }
    
    function getAll() {
        return httpService.getAllDocks()
    }

    function getAllOwned() {
        return httpService.getAllDocks()
    }
    
    function add(id, dock) {
        return httpService.addDock(id, dock);
    }

    function remove(dockid) {
        return httpService.removeDock(dockid);
    }

    return Object.freeze({ get, getAll, getAllOwned, add, remove });
}
