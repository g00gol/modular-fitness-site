import { Router } from "express";
import xss from "xss";
import * as timers from "../../data/timers.js";


const router = Router();


router.route("/").post(async (req, res) => {
    let { title, duration_hr, duration_min, duration_sec } = req.body;

    if(!title || !duration_hr || !duration_min || !duration_sec){return res.redirect("/modules?invalid=true");}

    try{
        title = xss(title);
        if(title.length > 200){throw "title length too long"}
        duration_hr = xss(duration_hr);
        duration_min = xss(duration_min);
        duration_sec = xss(duration_sec);


        duration_hr = parseInt(duration_hr)
        duration_min = parseInt(duration_min)
        duration_sec = parseInt(duration_sec)
    }catch(e){
        return res.redirect("/modules?invalid=true");
    }

    let duration = duration_hr*3600 + duration_min*60 + duration_sec;

    

    try{
        let createInfo = await timers.create(req.session.user.username, title, "timer", duration);
    }catch(e){
        console.log(e)
        return res.redirect("/modules?invalid=true");
    }

  return res.redirect("/modules");
});

router.route("/:timerId").post(async (req, res) => {
    let { title, duration_hr, duration_min, duration_sec, deleteTimer } = req.body;

    if(!title || !duration_hr || !duration_min || !duration_sec){return res.redirect("/modules?invalid=true");}


    try{
        title = xss(title);
        if(title.length > 200){throw "title length too long"}

        duration_hr = xss(duration_hr);
        duration_min = xss(duration_min);
        duration_sec = xss(duration_sec);
        deleteTimer = xss(deleteTimer);


        duration_hr = parseInt(duration_hr)
        duration_min = parseInt(duration_min)
        duration_sec = parseInt(duration_sec)
    }catch(e){
        return res.redirect("/modules?invalid=true");
    }

    let { timerId } = req.params;
    try{
        let user = (await timers.get(timerId)).username //make sure it exists
        if(user != req.session.user.username){throw "user does not have permission"}
    }catch(e){
        console.log(e)
        return res.redirect("/modules?invalid=true");
    }

    if(deleteTimer){
        try{
            await timers.remove(timerId) 
        }catch(e){
            console.log(e)
            return res.redirect("/modules?invalid=true");
        }
    }else{
        try{
            let duration = duration_hr*3600 + duration_min*60 + duration_sec;
            await timers.update(timerId, req.session.user.username, title, "timer", duration) 
        }catch(e){
            console.log(e)
            return res.redirect("/modules?invalid=true");
        }
    }

    return res.redirect("/modules");
  });





export default router;
