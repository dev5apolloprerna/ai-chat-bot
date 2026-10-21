import { supabase } from "../supabase.js";

export const addfaq = async (req, res) => {
    try {
        const id = req.user;
        const company_id = id;
        const { question, answer } = req.body;
        const { data, error } = await supabase.from("faqs").insert({
            question: question,
            answer: answer,
            company_id: company_id
        }).select();

        if (error) {
            return res.json({
                success: false,
                message: error.message
            });
        }
        else {
            return res.status(201).json({
                success: true,
                message: "your faq saved"
            })
        }
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export const editfaq = async (req, res) => {
    try {
        const id = req.user;
        const company_id = id;
        const { faq_id } = req.body;
        const { data, error } = await supabase.from("faqs").select("question, answer").eq("company_id", company_id).eq("faq_id", faq_id);
        if (error) {
            return res.json({
                success: false,
                message: error.message
            });
        }
        else {
            return res.status(201).json({
                message: "your faq fetched",
                data: {
                    question: data[0].question,
                    answer: data[0].answer
                },
                success: true
            })
        }
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const updatefaq = async (req, res) => {
    try {
        const id = req.user;
        const company_id = id;
        const { faq_id, question, answer } = req.body;
        const {data, error} = await supabase.from("faqs").update({
            question: question,
            answer: answer
        }).eq("company_id", company_id).eq("faq_id", faq_id);
        if(error){
             return res.json({
                success: false,
                message: error.message
            });
        }
        else{
            return res.status(201).json({
                message: "your faq updated",
                success: true
            })
        }
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export const deletefaq = async (req, res) => {
    try{
        const id = req.user;
        const company_id = id;
        const { faq_id } = req.body;
        const {data, error} = await supabase.from("faqs").delete().eq("company_id", company_id).eq("faq_id", faq_id);
        if(error){
             return res.json({
                success: false,
                message: error.message
            });
        }
        else{
            return res.status(201).json({
                success: true,
                message: "your faq deleted"
            })
        }
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}