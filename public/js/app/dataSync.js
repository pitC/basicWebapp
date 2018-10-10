import EVENTS from "../lib/commonEvents.js";
const DB_PERSISTANCE = "db"
const SOCKET = "socket"
const SYNC_TYPE = SOCKET
const URL = "objects"

var socket = io();

var isSocket = function(){
    if (SYNC_TYPE==SOCKET)
        return true
    else
        return false
}

function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function createResponse(item){
    var response = {
        data:item
    }
    return response;
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
    },

    createItem : function(item,callback){
        if (isSocket()){
            var newId = generateUUID();
            item._id = newId;
            socket.emit(EVENTS.ITEM_CREATED_EV,item);
            callback(createResponse(item));
        }
        else{
            // in case of API call let server assign an ID
            axios.post(URL, payload).then(response => callback(response));
        }
    },

    updateItem : function(item,callback){
        if (isSocket()){
            socket.emit(EVENTS.ITEM_UPDATED_EV,item);
            callback(createResponse(item));
        }
        else{
            axios.put(URL+"/"+item._id, item).then(response => callback(response));
        }
    }

}