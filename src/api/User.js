export function UserApi(httpService) {

    function addDock(dock) {
        return httpService.addUserDock(dock)
    }

    function getDocks(){
        return httpService.getUserDocks()
    }
    
    function removeDock(id){
        return httpService.removeUserDock(id)
    }

    return Object.freeze({ addDock, getDocks, removeDock });
}
