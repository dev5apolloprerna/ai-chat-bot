import { Router } from "express";
import { addfaq, editfaq, updatefaq, deletefaq } from "../controller/faq.js";
import { auth } from "../controller/reg.js";

const faqroute = Router();

faqroute.post('/add', auth, addfaq);
faqroute.post('/edit', auth, editfaq);
faqroute.post('/update', auth, updatefaq);
faqroute.post('/delete', auth, deletefaq);

export default faqroute;