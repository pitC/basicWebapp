import EVENTS from "../lib/commonEvents.js";
const DB_PERSISTANCE = "db"
const SOCKET = "socket"
const SYNC_TYPE = SOCKET
const URL = "http://localhost:3000/objects"

var socket = io();

var isSocket = function(){
    if (SYNC_TYPE==SOCKET)
        return true
    else
        return false
}

export default {
    events : EVENTS,

    registerPushEventHandler : function(event,callback){
        if (isSocket()){
            socket.on(event,callback);
        }
    },
    removeItem : function(item,callback){
        console.log("Remove item! "+SYNC_TYPE);
        if (isSocket()) {
            socket.emit(EVENTS.ITEM_REMOVED_EV,item);
            callback(null);
        }
        else {
            axios
        .delete(URL+"/" + item._id)
        .then(response => callback());
        }
    }

}