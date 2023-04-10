import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";
import { getByUsername } from "./users.js"
import {
    invalidParams,
    invalidStrings,
    invalidID,
} from "../helpers.js";

const createTimer = async (username, title, type, duration) => {
    invalidParams(title, type, duration);
    invalidStrings(title, type);
    if(typeof(duration) != "number"){throw "Duration must be a number"};
    if(duration <= 0){throw "Duration must be greater than 0"};


    let userCollection = await users();
    let user = await getByUsername(username);; //REPLACE WITH USER GET FUNCTION FROM USERS.JS
    let newTimer = {_id: new ObjectId, title: title, type: type, duration: duration}
    let createInfo = await userCollection.findOneAndUpdate({_id: new ObjectId(user._id)}, {$push: {timers: newTimer}}, {returnDocument: "after"});
    if(createInfo.lastErrorObject.n === 0){throw {errorCode: 500, errorMessage: "Error: could not add timer"};}

    

    newTimer._id = newTimer._id.toString();
    return newTimer;
}


const getAllTimers = async(username) => {
    let user = await getByUsername(username); //REPLACE WITH USER GET FUNCTION FROM USERS.JS
    let allTimers = user.timers;
    if (!user.timers || user.timers.length == 0){throw {errorCode: 400, errorMessage: "Error: user has no timers"}}
    for(let i = 0; i < allTimers.length; i++){
        allTimers[i]._id = allTimers[i]._id.toString();
    }
    return allTimers;
}

const getTimer = async (username, id) => {
    id = invalidID(id);
    let allTimers = await getAllTimers(username);
    for(let i = 0; i < allTimers.length; i++){
        if(allTimers[i]._id = id){
            return allTimers[i];
        }
    }
    throw {errorCode: 400, errorMessage: "Error: cannot find timer"}
}


const deleteTimer = async (username, id) => {
    id = invalidID(id);
    let userCollection = await users();
    let user = await getByUsername(username);; //REPLACE WITH USER GET FUNCTION FROM USERS.JS
    
    let allTimers = await getAllTimers(username);
    let deleted = undefined;

    

    for(let i = 0; i < allTimers.length; i++){
        if(allTimers[i]._id == id){
            deleted = allTimers[i];
            deleted._id = deleted._id.toString();

            allTimers.splice(i, 1)
            let deleteInfo = await userCollection.findOneAndUpdate({_id: new ObjectId(user._id)}, {$set: {timers: allTimers}}, {returnDocument: "after"});
            if(deleteInfo.lastErrorObject.n === 0){throw {errorCode: 500, errorMessage: "Error: could not delete timer"};}
            
            return {deleted: true, timer: deleted};
        }
    }
    throw {errorCode: 400, errorMessage: "Error: cannot find timer"}


}

const updateTimer = async (username, id, title, type, duration) => {
    invalidParams(title, type, duration);
    invalidStrings(title, type);
    if(typeof(duration) != "number"){throw "Duration must be a number"};
    if(duration <= 0){throw "Duration must be greater than 0"};
    id = invalidID(id);


    let userCollection = await users();
    let user = await getByUsername(username);; //REPLACE WITH USER GET FUNCTION FROM USERS.JS
    let allTimers = await getAllTimers(username);

    for(let i = 0; i < allTimers.length; i++){
        if(allTimers[i]._id == id){
            allTimers[i].title = title;
            allTimers[i].type = type;
            allTimers[i].duration = duration;

            let updateInfo = await userCollection.findOneAndUpdate({_id: new ObjectId(user._id)}, {$set: {timers: allTimers}}, {returnDocument: "after"});
            //({_id: new ObjectId(bandId)}, {$set: updateBand}, {returnDocument: "after"});
            if(updateInfo.lastErrorObject.n === 0){throw {errorCode: 500, errorMessage: "Error: could not update timer"};}

            return await getTimer(username, id);
        }
    }
    throw {errorCode: 400, errorMessage: "Error: could not find timer"};
}


export{
    createTimer,
    getTimer,
    getAllTimers,
    deleteTimer,
    updateTimer
}