import { Router } from "express";
import { user } from "../data/users.js";
import * as validation from "../helpers.js";

const router = Router();

router.route("/").get(async (req, res) => {});
