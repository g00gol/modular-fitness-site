import { Router } from "express";
import * as userData from "../data/index.js"
import * as fs from "fs"
import { Parser } from "json2csv"; 
import * as path from "path"
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



const router = Router();


router.route("/").get(async (req, res) => {
    let userId;
    let username;
    try{
        if (!req.session?.user) {
            return res.redirect("/login");
        }else{
            username = req.session.user.username
            userId = (await userData.users.getByUsername(username))._id; 
        }
    }catch(e){
        return res.render("myData", 
            {title: "my Data",
            error: ["Could not validate session"]
        })
    }

    //get all the users data
    let allData = {}
    try{
        allData.calories = await userData.calories.getCaloriesByUserID(userId)
        allData.cardio = await userData.cardio.getAll(username)
        allData.notes = await userData.notes.getNotesByUserID(userId)
        allData.timers = await userData.timers.getAll(username)
        allData.workouts = await userData.workouts.getWorkouts(userId)
    }catch(e){
        return res.render("myData", 
            {title: "my Data",
            error: [e]
        })
    }


   return res.render("myData", 
    {title: "my Data",
    data: allData})
});

router.route("/download").get(async (req, res) => {
    let userId;
    let username;
    try{
        if (!req.session?.user) {
            return res.redirect("/login");
        }else{
            username = req.session.user.username
            userId = (await userData.users.getByUsername(username))._id; 
        }
    }catch(e){
        return res.render("myData", 
            {title: "my Data",
            error: "Could not validate session"
        })
    }

    //get all the users data
    let allData = {}
    try{
        allData.calories = await userData.calories.getCaloriesByUserID(userId)
        allData.cardio = await userData.cardio.getAll(username)
        allData.notes = await userData.notes.getNotesByUserID(userId)
        allData.timers = await userData.timers.getAll(username)
        allData.workouts = await userData.workouts.getWorkouts(userId)
    }catch(e){
        return res.render("myData", 
            {title: "my Data",
            error: e
        })
    }

    try{
        const json2csvParser = new Parser({ header: true });
        const csvData = json2csvParser.parse(allData);

        fs.writeFile("./public/data.csv", csvData, function(error) {
            if (error) throw error;
        });
    }catch(e){
        console.log(e)
        return res.redirect("/myData")
    }
    
   return res.redirect("/myData")
});

export default router;