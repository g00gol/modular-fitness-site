import { Router } from "express";
import xss from "xss";
import * as cardio from "../../data/cardio.js";
import moment from "moment";


const router = Router();


router.route("/").post(async (req, res) => {
    let { cardioType, distance, duration, date, weight, calories } = req.body;

    if(!cardioType || !distance || !duration || !date){return res.redirect("/modules?invalid=true");}

    try{
        weight = xss(weight);
        calories = xss(calories);
        weight = parseInt(weight)
        calories = parseInt(calories)
    }catch(e){
        return res.redirect("/modules?invalid=true");
    }

    if(!calories){calories = -1}
    if(!weight){weight = -1}
    if(weight == -1 && calories == -1){calories = 0}
    

    try{
        cardioType = xss(cardioType);
        distance = xss(distance);
        duration = xss(duration);
        date = xss(date);
        distance = parseInt(distance)
        duration = parseInt(duration)
    }catch(e){
        return res.redirect("/modules?invalid=true");
    }
    

    try{
        let createInfo = await cardio.create(req.session.user.username, cardioType, distance, duration, date, calories, weight);
    }catch(e){
        console.log(e)
        return res.redirect("/modules?invalid=true");
    }

  return res.redirect("/modules");
});

router.route("/:cardioId").post(async (req, res) => {
    let { cardioType, distance, duration, date, weight, calories, deleteCardio } = req.body;

    if(!cardioType || !distance || !duration || !date){return res.redirect("/modules?invalid=true");}

    let { cardioId } = req.params;

    
    try{
        weight = xss(weight);
        calories = xss(calories);
        weight = parseInt(weight)
        calories = parseInt(calories)
    }catch(e){
        return res.redirect("/modules?invalid=true");
    }

    if(!calories){calories = -1}
    if(!weight){weight = -1}
    if(weight == -1 && calories == -1){calories = 0}
    

    try{
        cardioType = xss(cardioType);
        distance = xss(distance);
        duration = xss(duration);
        date = xss(date);
        distance = parseInt(distance)
        duration = parseInt(duration)
        if(duration < 0){throw "invalid duration"}
        if(distance < 0){throw "invalid distance"}
    }catch(e){
        return res.redirect("/modules?invalid=true");
    }

    try{
        let username = (await cardio.getByID(cardioId)).username;
        if(username != req.session.user.username){
            throw("User does not have permisions to edit")
        }
    }catch(e){
        console.log(e);
        return res.redirect("/modules?invalid=true");
    }
    
    if(deleteCardio){
        try{
            await cardio.remove(cardioId);
        }catch(e){
            console.log(e)
            return res.redirect("/modules?invalid=true");
        }
    }else{
        try{
            await cardio.update(cardioId, req.session.user.username, cardioType, distance, duration, date, calories, weight);
        }catch(e){
            console.log(e)
            return res.redirect("/modules?invalid=true");
        }
    }

  return res.redirect("/modules");
});






export default router;
