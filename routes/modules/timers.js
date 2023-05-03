import { Router } from "express";
import xss from "xss";
import * as timers from "../../data/timers.js";


const router = Router();


router.route("/").post(async (req, res) => {
    console.log(req.body)
    let { title, duration_hr, duration_min, duration_sec } = req.body;

    if(!title || !duration_hr || !duration_min || !duration_sec){return res.redirect("/modules?invalid=true");}


    title = xss(title);
    duration_hr = xss(duration_hr);
    duration_min = xss(duration_min);
    duration_sec = xss(duration_sec);


    duration_hr = parseInt(duration_hr)
    duration_min = parseInt(duration_min)
    duration_sec = parseInt(duration_sec)

    let duration = duration_hr*3600 + duration_min*60 + duration_sec;

    

    try{
        let createInfo = await timers.create(req.session.user.username, title, "timer", duration);
    }catch(e){
        console.log(e)
        return res.redirect("/modules?invalid=true");
    }

  return res.redirect("/modules");
});

export default router;
