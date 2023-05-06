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
  } from "../utils/helpers.js";
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
        await weightsCollection.findOneAndDelete({username: username});
        // can retrun whatever here.
    }
    catch (e) 
    {
        console.log(e);
        throw `Error: could not delete.`;
    }

};
//will use this to create stats for the user.
const getAllWeightsObj = async (username) =>
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
    }
    catch (e)
    {
        console.log(e)
        throw `error user does not exists in the users collection.`
    }
    try 
    {
        let weightsCollection = await weights();
        let record = await weightsCollection.findOne({username: username});
        return record.data;
        
    }
    catch (e) 
    {
        console.log(e);
        throw `Error: could not find.`;
    }
};

const getWeightById = async(id) =>
{
    invalidID(id);
    try 
    {
        let weightsCollection = await weights();
        let record = await weightsCollection.findOne({data: {$elemMatch: {_id: new ObjectId(id)}}});
        let ans = record["data"].find(data => data._id.toString() === id)
        return ans;
        // return record;  
    }
    catch (e) 
    {
        console.log(e);
        throw `Error: could not find weight of Id: ${id}.`;
    }
}

const updateWeightEntry = async (id, weight) =>
{
    invalidID(id)
    if(!weight)
    {
        throw `Missing the new weight num`
    }
    if(typeof weight != 'number' || isNaN(weight) || weight <= 0 || weight > 1000)
    {
        throw `weight must be a valid number`
    }
    try 
    {
        let weightsCollection = await weights();
        let update = await weightsCollection.updateOne({'data._id': new ObjectId(id)}, {$set:{'data.$.weight':weight}} ); // https://www.mongodb.com/community/forums/t/update-nested-sub-document-with-a-specific-condition/136373
        if(update.matchedCount === 0 )
        {
            throw `Error: coudl not update.`
        }
        
        // return record;  
    }
    catch (e) 
    {
        console.log(e);
        throw `Error: could not find weight of Id: ${id}.`;
    }

}
//this function is used to delete a weight entry from the weights collection.
const deleteOneWeightEnrty  = async(username, id) =>
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
    try
    {
        let weightCollection = await weights();
        let record = await weightCollection.findOne({data: {$elemMatch: {_id: new ObjectId(id)}}});
        let done = await weightCollection.findOneAndUpdate({_id: record["_id"]},{$pull: {data: {_id: new ObjectId(id)}}})
        if (done === null) 
        {
          throw 'Error: this id did not exist.';
        }  
    }
    catch (e) 
    {
        console.log(e);
        throw `Error: could not delete weight entry of Id: ${id}.`;
    }


}

const getLastWeightReading = async (username) =>
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
    }
    catch (e)
    {
        console.log(e)
        throw `error user does not exists in the users collection.`
    }
    try 
    {
        let weightCollection = await weights();
        let record = await weightCollection.findOne({username: username});
        if (record) {
            let data = record.data;
            let ans = data[data.length - 1];
            return ans;
        }
        return [];
    }
    catch (e) 
    {
        console.log(e);
        throw `Error: could not find.`;
    }

};
// this function will add goal to the weights collection for the given username.
const addGoal = async (username, goal) =>
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
    if(!goal)
    {
        throw `Error: goal not provided.`
    }
    if(typeof goal != 'number' || isNaN(goal) || goal <= 0 || goal > 1000)
    {
        throw `goal must be a valid number`
    }
    try
    {
        let weightCollection = await weights();
        let weight = await weightCollection.findOne({ username: username });
        if (!weight) // no weight object for this user
        {
            weight = { username: username, goal: goal, data: [] };
            let result = await weightCollection.insertOne(weight);
            if (!result.insertedId) 
            {
                throw "Could not add new weight object.";
            }
        }
        else if(!('goal' in weight) || weight.goal !== goal) // weight object exists but no goal or goal is different
        {
            weight.goal = goal;
            let result = await weightCollection.updateOne({ username: username }, { $set: weight });
            if (result.modifiedCount === 0) 
            {
                throw "Could not update weight object.";
            }
        }
    }
    catch (e) 
    {
        console.log(e);
        throw `Error: could not add goal.`;
    }
};

const getGoal = async (username) =>
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
    }
    catch (e)
    {
        console.log(e)
        throw `error user does not exists in the users collection.`
    }
    try
    {
        let weightCollection = await weights();
        let weight = await weightCollection.findOne({ username: username });
        if (weight && 'goal' in weight) 
        {
            return weight.goal;
        }
        // return null;
    }
    catch (e)
    {
        console.log(e);
        throw `Error: could not find goal.`;
    }
};
export { enterWeight, deleteAllWeightDataForUser,getGoal, addGoal, getLastWeightReading, getAllWeightsObj, getWeightById, deleteOneWeightEnrty, updateWeightEntry };