import { Router } from "express";
import xss from "xss";
import * as cardio from "../../data/cardio.js";
import moment from "moment";


const router = Router();


router.route("/").post(async (req, res) => {
    let { cardioType, distance, duration, date, weight, calories } = req.body;

    if(!cardioType || !distance || !duration || !date){return res.redirect("/modules?invalid=true");}


    weight = xss(weight);
    calories = xss(calories);
    weight = parseInt(weight)
    calories = parseInt(calories)

    if(!calories){calories = -1}
    if(!weight){weight = -1}
    if(weight == -1 && calories == -1){calories = 0}
    

    cardioType = xss(cardioType);
    distance = xss(distance);
    duration = xss(duration);
    date = xss(date);
    

    distance = parseInt(distance)
    duration = parseInt(duration)
    

    try{
        let createInfo = await cardio.create(req.session.user.username, cardioType, distance, duration, date, calories, weight);
    }catch(e){
        console.log(e)
        return res.redirect("/modules?invalid=true");
    }

  return res.redirect("/modules");
});

export default router;
