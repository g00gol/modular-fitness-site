import { Router } from "express";
import xss from "xss";
import * as users from "../data/users.js";
import moment from "moment";


const router = Router();


router.route("/:userId").post(async (req, res) => {
    let { fullName, bio, profilePictureInput, oldPassword, newPassword } = req.body;

    if(!fullName){return res.redirect("/modules?invalid=true");}
    if(!bio){bio = ""}
    if(!profilePictureInput){profilePictureInput = "../public/assets/images/Logo.png"}

    let updatePassword = false;
    if(oldPassword && newPassword){
        updatePassword = true;
    }

    let { userId } = req.params;

    fullName = xss(fullName);
    bio = xss(bio);
    profilePictureInput = xss(profilePictureInput) 
    oldPassword = xss(oldPassword);
    newPassword = xss(newPassword)

    let user;
    try{
        user = await users.getByUsername(req.session.user.username);
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

    if(updatePassword){
        try{
            await users.checkUser(user.username, oldPassword)
        }catch(e){
            return res.status(400).render("dashboard", {
                title: "Dashboard",
                user: req.session.user,
                userData: user,
                editProfile: "",
                error: ["Password is incorrect"]
              })
        }
        try{
            let updatedPassword = await users.updatePassword(userId, oldPassword, newPassword);
            if(!updatedPassword){throw "Could not update password"}
        }catch(e){
            console.log(e)
            return res.redirect("/modules?invalid=true");
        }
    }

  return res.redirect("/dashboard");
});

export default router;