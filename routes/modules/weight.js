import { Router } from "express";
import xss from "xss";
import * as weights from "../../data/weight.js"

const router = Router();

router.route("/").post(async (req, res) => 
{
    let weightEntry = req.body.weightInput;
    let username = req.session.user.username;
    username = xss(username);
    weightEntry = parseFloat(xss(weightEntry)); // if this is undefined, parseFloat will make it NaN and that will cause redirect to error page
    if(!weightEntry || typeof weightEntry != 'number'  || isNaN(weightEntry))
    {
        console.log(weightEntry);
        console.log(typeof weightEntry);
        return res.redirect("/error?status=400");
    }
    if (weightEntry <= 0)
    {
        return res.redirect("/error?status=400");
    }
    try
    {
        let newWeight = await weights.enterWeight(username, weightEntry)
    }
    catch (e)
    {
        return res.redirect("/modules?invalid=true");
    }
    return res.redirect("/modules");

});

export default router;