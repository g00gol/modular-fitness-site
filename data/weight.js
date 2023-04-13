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
    if (result.matchedCount === 0)  // the case where the user does exist but this is the first weight entry.
    {
        await weightsCollection.insertOne(
        {
            _id: new ObjectId(),
            username: username,
            data: [newEntry],
        });
        // can retrun whatever here
    }
    } 
    catch (e) 
    {
    throw `Error: could not insert weight reading for ${username}`;
    }

};
// this function will delete all the data for a user in the weights collection.
const deleteAllWeightDataForUser = async (username) =>
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
        let weightsCollection = await weights();
        await weightsCollection.deleteMany({username: username});
        // can retrun whatever here.
    }
    catch (e) 
    {
        console.log(e);
        throw `Error: could not delete.`;
    }

}
// await deleteAllWeightDataForUser("mkaur")
export { enterWeight, deleteAllWeightDataForUser };