import { Router } from "express";
import xss from "xss";
import * as sugars from "../../data/sugar.js"


const router = Router();

router.route("/").post(async (req, res) => 
{
    let sugarEntry = req.body.sugarInput;
    console.log("req.body.fastingInput is ======="+req.body.fastingInput)
    let fasting;
    if(!req.body.fastingInput)
    {
        fasting = false;
    }
    else
    {
        fasting = true;
    }
    let username = req.session.user.username;
    username = xss(username);
    sugarEntry = parseFloat(xss(sugarEntry));
    
    
    if(fasting != true && fasting != false) // fasting is not a boolean value, so it will be true if it is a string
    {
        // console.log("fasting value is ::::::::::::::::::::: "+fasting)
        return res.redirect("/error?status=400");
    }
    console.log(sugarEntry);
    console.log(fasting);
    console.log(typeof sugarEntry)
    console.log(typeof fasting)

    if(!sugarEntry || typeof sugarEntry != 'number'  || isNaN(sugarEntry))
    {
        // console.log(sugarEntry);
        // console.log(fasting);
        // console.log(typeof sugarEntry)
        // console.log(typeof fasting)
        return res.redirect("/error?status=400");
    }
    if (sugarEntry <= 0 || sugarEntry >= 300)
    {
        return res.redirect("/error?status=400");
    }
    try
    {
        let newSugar = await sugars.enterSugar(username,sugarEntry,fasting)
        // const lastReading = await getLastSugarReading(username);
        // res.render('bloodSugarTracker', { lastReading });
    }
    catch (e)
    {
        return res.redirect("/modules?invalid=true");
    }
    return res.redirect("/modules");
});


router.route("/last").get(async (req, res) => {
    // Check if the request is not being made from the browser URL
    let isClientSideRequest = req.header("X-Client-Side-Request") === "true";
    if (!isClientSideRequest) {
        return res.redirect("/error?status=403");
    }

    let {uid, username} = req.session.user;

    // Check if uid and username both exist
    if (!uid || !username) {
        return res.redirect("/error?status=500");
    }

    let sugar;
    try {
        sugar = await sugars.getLastSugarReading(username);
    } catch (e) {
        return res.json({error: "Internal Server Error"});
    }

    return res.json(sugar);
});


export default router;