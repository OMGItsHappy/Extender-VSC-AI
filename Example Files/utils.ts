import OpenAI from "openai";

export async function chat(openai: OpenAI, modelToUse:string, text: string)
{   
    const response = await openai.chat.completions.create({
        messages:[{role: "user", content: text}],
        model: modelToUse
    });

    if (response.choices[0].message) {
        let answer = response.choices[0].message.content?.toString() || 'No message';
        
        return answer;
    }
    else {
        return "No Response";
    }
}

export function noteToString(note: {name: string, text: string, response: string}) {
    let name = note.name + "\n";
    let text = note.text.trim() + (note.text.trim() === "" ? "\n" : "\n\n");
    let response = note.response.trim() + (note.response.trim() === "" ? "" : "\n\n");
    return name + text + response;
}

export function notesToString(notes: Array<{name: string, text: string, response: string}>) : string {
    var output = "";
    for (let i = 0; i < notes.length; i++) {
        output += noteToString(notes[i]);
    }
    return output;
}