import { ObjectId } from "mongodb";
import { weights } from "../config/mongoCollections.js";
import { users } from "../config/mongoCollections.js";
import moment from 'moment'
import {
    invalidParams,
    invalidStrings,
    invalidStrArrays,
    invalidID,
    arraysEqual,
    invalidNum,
  } from "../helpers.js";
  import { getByUsername } from "./users.js"

const enterWeight = async (username, weightReading) => 
{
    if(!username || !weightReading)
    {
        throw `Missing parameters`
    }
    if(typeof username != 'string' || username.trim().length === 0 )
    {
        throw `Username needs to be a non empty string`
    }
    if (typeof weightReading != 'number' || isNaN(weightReading) )
    {
        throw `Weightreading must be a valid number`
    }
    if (weightReading <= 0)
    {
        throw `weight does not seem to be correct. `
    }
    username = username.trim()
    let user
    try 
    {
        let userCollection = await users();
        user = await getByUsername(username)
        // console.log(user)
    }
    catch (e)
    {
        console.log(e)
        throw `error user does not exists.`
    }
    
    let newEntry = 
    {
        _id: new ObjectId(),
        weight: weightReading,
        time: moment().format()
    };
    try 
    {
    let weightsCollection = await weights();
    let result = await weightsCollection.updateOne
    (
        {username: username},
        {$push:{data: newEntry}}
    )
    if (result.matchedCount === 0) 
    {
        await weightsCollection.insertOne(
        {
            _id: new ObjectId(),
            username: username,
            data: [newEntry],
        });
    }
    } 
    catch (e) 
    {
    throw `Error: could not insert weight reading for ${username}`;
    }

};
export { enterWeight };