import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Mode } from "@google/genai";

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

dotenv.config();
const GEMINI_API_KEY = "AIzaSyDvmRlhfxqWdAYBcH9n0A8CEoojPi2AfSc";
// const ai = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY;
// })

async function runGemini() {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});
    const prompt = "what's my character limit using this free gemini api, input + output";
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("Reply: ", text);
    } catch (error) {
        console.error("error generating prompt");
    }
}

app.get("/", async(req,res)=>{
    await runGemini();
});


app.listen(port, ()=>{
    console.log(`server running on port: ${port}`);
})