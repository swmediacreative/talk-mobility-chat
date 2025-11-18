{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import OpenAI from "openai";\
\
const client = new OpenAI(\{\
  apiKey: process.env.OPENAI_API_KEY\
\});\
\
export default async function handler(req, res) \{\
  // Allow browser requests\
  res.setHeader("Access-Control-Allow-Origin", "*");\
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");\
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");\
\
  if (req.method === "OPTIONS") \{\
    return res.status(200).end();\
  \}\
\
  try \{\
    const \{ message \} = req.body;\
\
    const prompt = `\
You are Talk Mobility, a warm, conversational assistant that helps people with mobility challenges \'97 or their carers \'97 find clear, factual advice about mobility products like stairlifts, scooters, walkers, and bathroom aids. You speak kindly, simply, and focus on safety, comfort, and independence.\
    `;\
\
    const completion = await client.chat.completions.create(\{\
      model: "gpt-4o-mini",\
      messages: [\
        \{ role: "system", content: prompt \},\
        \{ role: "user", content: message \}\
      ]\
    \});\
\
    const reply = completion.choices[0].message.content;\
    res.status(200).json(\{ reply \});\
  \} catch (error) \{\
    console.error(error);\
    res.status(500).json(\{ error: "Error fetching response" \});\
  \}\
\}\
}