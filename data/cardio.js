import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";
import { getByUsername } from "./users.js"
import {
    invalidParams,
    invalidStrings,
    invalidID,
} from "../helpers.js";


const createCardio = async (username, type, distance, duration, dateTime, caloriesBurned) => {
    //allow user to input the calories burned if they know, otherwise calculate automatically.
    //use <= 0 to signal that calories burned was not inputted

    invalidParams(type, distance, duration, dateTime, caloriesBurned);
    invalidStrings(type);
    if(type != "walk" && type != "run" && type != "cycle" && type != "swim"){throw "invalid cardio type"}
    //validate dateTime?
    if(typeof(duration) != "number"){throw "Duration must be a number"};
    if(duration <= 0){throw "Duration must be greater than 0"};
    if(typeof(distance) != "number"){throw "Distance must be a number"};
    if(distance <= 0){throw "Distance must be greater than 0"};
    if(typeof(caloriesBurned) != "number"){throw "caloriesBurned must be a number"};
    if(caloriesBurned <= 0){caloriesBurned = calculateCaloriesBurned(60, distance, duration, type)}; //get the weight somehow


    let userCollection = await users();
    let user = await getByUsername(username);; //REPLACE WITH USER GET FUNCTION FROM USERS.JS
    let newCardio = {_id: new ObjectId, type: type, distance: distance, duration: duration, dateTime: dateTime, caloriesBurned: caloriesBurned};
    let createInfo = await userCollection.findOneAndUpdate({_id: new ObjectId(user._id)}, {$push: {cardios: newCardio}}, {returnDocument: "after"});
    if(createInfo.lastErrorObject.n === 0){throw {errorCode: 500, errorMessage: "Error: could not add Cardio Workout"};}

    

    newCardio._id = newCardio._id.toString();
    return newCardio;

}

const getAllCardios = async (username) => {
    let user = await getByUsername(username); 
    let allCardios = user.cardios;
    if (!user.cardios || user.cardios.length == 0){throw {errorCode: 400, errorMessage: "Error: user has no cardios"}}
    for(let i = 0; i < allCardios.length; i++){
        allCardios[i]._id = allCardios[i]._id.toString();
    }
    return allCardios;
}

const getCardioByID = async (username, id) => {
    id = invalidID(id);
    let allCardios = await getAllCardios(username);
    for(let i = 0; i < allCardios.length; i++){
        if(allCardios[i]._id = id){
            return allCardios[i];
        }
    }
    throw {errorCode: 400, errorMessage: "Error: cannot find cardio"}
}


const getCardioByDate = async (username, dateTime) => {
    
}


const getCardioByType = async (username, type) => {
    invalidStrings(type);
    if(type != "walk" && type != "run" && type != "cycle" && type != "swim"){throw "invalid cardio type"}

    let allCardios = await getAllCardios(username);
    let allOfType = []
    for(let i = 0; i < allCardios.length; i++){
        if(allCardios[i].type == type){
            allOfType.push(allCardios[i]);
        }
    }
    if(allOfType.length == 0){throw {errorCode: 400, errorMessage: "Error: No cardio of this type"}};
    return allOfType;
}


const deleteCardio = async (username, id) => {
    id = invalidID(id);
    let userCollection = await users();
    let user = await getByUsername(username);; //REPLACE WITH USER GET FUNCTION FROM USERS.JS
    
    let allCardios = await getAllCardios(username);
    let deleted = undefined;

    

    for(let i = 0; i < allCardios.length; i++){
        if(allCardios[i]._id == id){
            deleted = allCardios[i];
            deleted._id = deleted._id.toString();

            allCardios.splice(i, 1)
            let deleteInfo = await userCollection.findOneAndUpdate({_id: new ObjectId(user._id)}, {$set: {cardios: allCardios}}, {returnDocument: "after"});
            if(deleteInfo.lastErrorObject.n === 0){throw {errorCode: 500, errorMessage: "Error: could not delete cardio workout"};}
            
            return {deleted: true, cardio: deleted};
        }
    }
    throw {errorCode: 400, errorMessage: "Error: cannot find cardio workout"}
    
}


const updateCardio = async (username, id, type, distance, duration, dateTime, caloriesBurned) => {
    invalidParams(type, distance, duration, dateTime, caloriesBurned);
    invalidStrings(type);
    if(type != "walk" && type != "run" && type != "cycle" && type != "swim"){throw "invalid cardio type"}
    //validate dateTime?
    if(typeof(duration) != "number"){throw "Duration must be a number"};
    if(duration <= 0){throw "Duration must be greater than 0"};
    if(typeof(distance) != "number"){throw "Distance must be a number"};
    if(distance <= 0){throw "Distance must be greater than 0"};
    if(typeof(caloriesBurned) != "number"){throw "caloriesBurned must be a number"};
    if(caloriesBurned <= 0){caloriesBurned = calculateCaloriesBurned(60, distance, duration, type)}; //get the weight somehow


    let userCollection = await users();
    let user = await getByUsername(username);; //REPLACE WITH USER GET FUNCTION FROM USERS.JS
    let allCardios = await getAllCardios(username);

    for(let i = 0; i < allCardios.length; i++){
        if(allCardios[i]._id == id){
            allCardios[i].title = title;
            allCardios[i].type = type;
            allCardios[i].duration = duration;

            let updateInfo = await userCollection.findOneAndUpdate({_id: new ObjectId(user._id)}, {$set: {cardios: allCardios}}, {returnDocument: "after"});
            //({_id: new ObjectId(bandId)}, {$set: updateBand}, {returnDocument: "after"});
            if(updateInfo.lastErrorObject.n === 0){throw {errorCode: 500, errorMessage: "Error: could not update cardio workout"};}

            return await getCardioByID(username, id);
        }
    }
    throw {errorCode: 400, errorMessage: "Error: could not find cardio workout"};
}





//calculate calories burned
/**
 * weight (kgs)
 * distance (miles) 
 * time (hours)
 * 
 */
let calculateCaloriesBurned = (weight, distance, time, type) => {
    let mets = {
        walk: (speed) => {return speed * 1.7},
        run: (speed) => {return speed * 1.7},
        cycle: (speed) => {return speed * speed * .04},
        swim: (speed) => {return 7}
    }

    return mets[type](distance/time) * weight * time;
}


export{
    createCardio,
    getCardioByID,
    getCardioByDate,
    getAllCardios,
    getCardioByType,
    deleteCardio,
    updateCardio
}