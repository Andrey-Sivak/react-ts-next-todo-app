import {NextResponse} from "next/server";
import openai from "@/openai";

export async function POST(request: Request) {
    const {todos} = await request.json();

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        n: 1,
        messages: [
            {
                role: 'system',
                content: `When responding, welcome the user always as dear User and say welcome to the Trello TODO App!
                         Limit the response to 200 characters`,
            },
            {
                role: 'user',
                content: `Hi there, provide a summary of the following todos. Count how many todos are in each category such as To do, In progress and done, then tell the user to have a productive day! Here's the data: ${JSON.stringify(todos)}`,
            }
        ],
        stream: false,
    });

    // @ts-ignore
    const {data} = response;

    // console.log('data ', data);
    // console.log('mess ', data.choices[0].message);

    return NextResponse.json(data.choices[0].message);
}