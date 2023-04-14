import { ObjectId } from "mongodb";
import { sugar } from "../config/mongoCollections.js";
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

const enterSugar = async (username, sugarReading, fasting) => 
{
    if(!username || !sugarReading)
    {
        throw `Missing parameters`
    }
    if(typeof username != 'string' || username.trim().length === 0 )
    {
        throw `Username needs to be a non empty string`
    }
    if (typeof sugarReading != 'number' || isNaN(sugarReading) )
    {
        throw `SugarReading must be a valid number`
    }
    if (sugarReading <= 0)
    {
        throw `sugarReading does not seem to be correct. `
    }
    if(typeof fasting != 'boolean')
    {
        throw `error: fasting should be a bool`
    }
    username = username.trim()
    let user
    try 
    {
        let userCollection = await users();
        user = await getByUsername(username)
    }
    catch (e)
    {
        console.log(e)
        throw `error user does not exists.`
    }

    let newEntry = 
    {
        _id: new ObjectId(),
        sugarReading: sugarReading,
        time: moment().format(),
        fasting: fasting
    };
    try 
    {
    let sugarCollection = await sugar();
    let result = await sugarCollection.updateOne
    (
        {username: username},
        {$push:{data: newEntry}}
    )
    if (result.matchedCount === 0) 
    {
        await sugarCollection.insertOne(
        {
            _id: new ObjectId(),
            username: username,
            data: [newEntry],
        });
    }
    } 
    catch (e) 
    {
    throw `Error: could not insert sugarreading reading for ${username}`;
    }

};

const deleteAllSugarDataForUser = async (username) =>
{
    if(!username)
    {
        throw `Error: username not provided.`
    }
    if(typeof username != 'string' || username.trim().length === 0)
    {
        throw `Error: username must be a non empty string.`
    }
    username = username.trim();
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
        throw `error user does not exists in the users collection.`
    }
    try 
    {
        let sugarCollection = await sugar();
        await sugarCollection.findOneAndDelete({username: username});
        // can retrun whatever here.
    }
    catch (e) 
    {
        console.log(e);
        throw `Error: could not delete.`;
    }

};
const deleteOneSugarEnrty  = async(username, id) =>
{
    if(!username)
    {
        throw `Error: username not provided.`
    }
    if(typeof username != 'string' || username.trim().length === 0)
    {
        throw `Error: username must be a non empty string.`
    }
    username = username.trim();
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
        throw `error user does not exists in the users collection.`
    }
    id = invalidID(id)
    
    
}
export {enterSugar, deleteAllSugarDataForUser, deleteOneSugarEnrty};