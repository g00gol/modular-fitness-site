import { Router } from "express";
import xss from "xss";
import * as weights from "../../data/weight.js";

const router = Router();

router.route("/").post(async (req, res) => {
  let weightEntry = req.body.weightInput;
  let username = req.session.user.username;
  username = xss(username);
  weightEntry = parseFloat(xss(weightEntry)); // if this is undefined, parseFloat will make it NaN and that will cause redirect to error page
  if(!username)
  {
    return res.redirect("/error?status=400");
  }
  if (!weightEntry || typeof weightEntry != "number" || isNaN(weightEntry)) {
    console.log(weightEntry);
    console.log(typeof weightEntry);
    return res.redirect("/error?status=400");
  }
  if (weightEntry <= 0 || weightEntry >= 1000) {
    return res.redirect("/error?status=400");
  }
  try {
    let newWeight = await weights.enterWeight(username, weightEntry);
  } catch (e) {
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

    let weight;
    try {
        weight = await weights.getLastWeightReading(username);
    } catch (e) {
        return res.json({error: "Internal Server Error"});
    }

    return res.json(weight);
});


router.route("/goal").post(async (req, res) => {
  let goal = req.body.goalWeightInput;
  let username = req.session.user.username;
  username = xss(username);
  goal = parseFloat(xss(goal)); // if this is undefined, parseFloat will make it NaN and that will cause redirect to error page
  if (!username) 
  {
    return res.redirect("/error?status=400");
  }
  if (!goal || typeof goal != "number" || isNaN(goal)) 
  {
    console.log(goal);
    console.log(typeof goal);
    return res.redirect("/error?status=400");
  }
  if (goal <= 0 || goal >= 1000) 
  {
    return res.redirect("/error?status=400");
  }
  try 
  {
    let newGoal = await weights.addGoal(username, goal);
  } 
  catch (e)
  {
    return res.redirect("/modules?invalid=true");
  }
  return res.redirect("/modules");
});

router.route("/goal").get(async (req, res) => 
{
    // Check if the request is not being made from the browser URL
    let isClientSideRequest = req.header("X-Client-Side-Request") === "true";
    if (!isClientSideRequest) {
        return res.redirect("/error?status=403");
    }
    let {uid, username} = req.session.user;
    if (!uid || !username) 
    {
      return res.redirect("/error?status=500");
    }
    let goal;
    try
    {
      goal = await weights.getGoal(username);
    }
    catch (e)
    {
      return res.json({error: "Internal Server Error"});
    }
    return res.json(goal);
});
export default router;
