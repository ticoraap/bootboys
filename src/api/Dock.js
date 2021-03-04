export function DockApi(httpService) {
    function get(id) {
        return httpService.getDock(id)
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

    function remove(id) {
        return httpService.removeDock(id);
    }

    return Object.freeze({ get, getAll, getAllOwned, add, remove });
}
