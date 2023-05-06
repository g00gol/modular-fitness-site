import { Router } from "express";
import xss from "xss";
import * as users from "../data/users.js";
import moment from "moment";


const router = Router();


router.route("/:userId").post(async (req, res) => {
    let { fullName, bio, profilePictureInput } = req.body;

    if(!fullName){return res.redirect("/modules?invalid=true");}
    if(!bio){bio = ""}
    if(!profilePictureInput){profilePictureInput = "../public/assets/images/Logo.png"}

    let { userId } = req.params;

    fullName = xss(fullName);
    bio = xss(bio);
    profilePictureInput = xss(profilePictureInput) 

    try{
        let user = await users.getByUsername(req.session.user.username);
        if (user._id != userId){throw "user does not have access to update this data"}
        
    }catch(e){
        console.log(e);
        return res.redirect("/modules?invalid=true");
    }
    
    try{
        let updated = await users.updateUserById(userId, fullName, bio, profilePictureInput);
        if(!updated){throw "Could not update"}
        req.session.user.fullName = fullName;
    }catch(e){
        console.log(e)
        return res.redirect("/modules?invalid=true");
    }

  return res.redirect("/modules");
});

export default router;