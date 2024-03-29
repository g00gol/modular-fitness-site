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
  } from "../utils/helpers.js";
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
    if (sugarReading <= 0 || sugarReading >= 300)
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
    try
    {
        let sugarCollection = await sugar();
        let record = await sugarCollection.findOne({data: {$elemMatch: {_id: new ObjectId(id)}}});
        let done = await sugarCollection.findOneAndUpdate({_id: record["_id"]},{$pull: {data: {_id: new ObjectId(id)}}})
        if (done === null) 
        {
          throw 'Error: this id did not exist.';
        }  
    }
    catch (e) 
    {
        console.log(e);
        throw `Error: could not delete sugar of Id: ${id}.`;
    }


}
const updateSugartEntry = async (id, sugarReading, fasting) =>
{
    invalidID(id)
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
    try 
    {
        let sugarCollection = await sugar();
        let update = await sugarCollection.updateOne({'data._id': new ObjectId(id)}, {$set:{'data.$.sugarReading':sugarReading, 'data.$.fasting': fasting}}); // https://www.mongodb.com/community/forums/t/update-nested-sub-document-with-a-specific-condition/136373
        if(update.matchedCount === 0 )
        {
            throw `Error: coudl not update.`
        }
        
        // return record;  
    }
    catch (e) 
    {
        console.log(e);
        throw `Error: could not find sugar of Id: ${id}.`;
    }

}
const getSugarById = async(id) =>
{
    invalidID(id);
    try 
    {
        let sugarCollection = await sugar();
        let record = await sugarCollection.findOne({data: {$elemMatch: {_id: new ObjectId(id)}}});
        let ans = record["data"].find(data => data._id.toString() === id)
        return ans;
        // return record;  
    }
    catch (e) 
    {
        console.log(e);
        throw `Error: could not find sugar of Id: ${id}.`;
    }
}
//will use this to create stats for the user.
const getAllSugarObj = async (username) =>
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
    // console.log("username in data function is "+username)
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
        let sugarCollection = await sugar();
        let record = await sugarCollection.findOne({username: username});
        return record?.data;
        
    }
    catch (e) 
    {
        console.log(e);
        throw `Error: could not find.`;
    }
};

const getLastSugarReading = async (username) =>
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
        let sugarCollection = await sugar();
        let record = await sugarCollection.findOne({username: username});
        // Check if record is null
        if (record === null) {
            return [];
        }

        let data = record.data;
        let ans = data[data.length - 1];

        return ans; 
    }
    catch (e) 
    {
        console.log(e);
        throw `Error: could not find.`;
    }

};
export {enterSugar, deleteAllSugarDataForUser, getLastSugarReading, deleteOneSugarEnrty, getSugarById, getAllSugarObj, updateSugartEntry};