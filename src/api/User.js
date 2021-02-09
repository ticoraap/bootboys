export function getUserApi(httpService) {

    function addDock(userDock) {
        return httpService.addUserDock(userDock)
    }

    function getDocks(){
        return httpService.getUserDocks()
    }
    
    function removeDock(dockid){
        return httpService.removeUserDock(dockid)
    }

    return Object.freeze({ addDock, getDocks, removeDock });
}
