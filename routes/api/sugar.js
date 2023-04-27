import { Router } from "express";
import bcrypt, { hash } from "bcrypt";
import xss from "xss";

import * as users from "../../data/users.js";
import { getAllSugarObj } from "../../data/sugar.js"
import session from "express-session";

const sugarRouter = Router();
sugarRouter
  .route("/sugar")
  .post(async (req, res) => 
    {
        if(!session.user)
        {
            return res.redirect("/error?403")
        }
        let user
        try
        {
           user = await users.getByUsername(session.user.username) 
        }
        catch (e)
        {
            return res.redirect("/error?404")
        }
        try 
        {
            let data = await getAllSugarObj(session.user.username) 
            return data;
        }
        catch (e)
        {
            return res.redirect("/error?404")
        }

        
    });


    export { sugarRouter };