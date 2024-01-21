"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notesToString = exports.noteToString = exports.chat = void 0;
async function chat(openai, modelToUse, text) {
    const response = await openai.chat.completions.create({
        messages: [{ role: "user", content: text }],
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
exports.chat = chat;
function noteToString(note) {
    let name = note.name + "\n";
    let text = note.text.trim() + (note.text.trim() === "" ? "\n" : "\n\n");
    let response = note.response.trim() + (note.response.trim() === "" ? "" : "\n\n");
    return name + text + response;
}
exports.noteToString = noteToString;
function notesToString(notes) {
    var output = "";
    for (let i = 0; i < notes.length; i++) {
        output += noteToString(notes[i]);
    }
    return output;
}
exports.notesToString = notesToString;
async function fetchData(url) {
    return new Promise((resolve, reject) => {
        // Simulate an asynchronous HTTP request
        setTimeout(() => {
            // Simulate an error condition (e.g., network error)
            reject(new Error('Failed to fetch data. Network error.'));
        }, 2000);
    });
}
async function processData() {
    try {
        const data = await fetchData('https://example.com/api/data');
        console.log('Received data:', data);
    }
    catch (error) {
        console.error('Error:', error.message);
        throw new Error('Failed to process data.'); // Propagate the error
    }
}
async function main() {
    try {
        await processData();
        console.log('Processing complete.');
    }
    catch (error) {
        console.error('Main Error:', error.message);
    }
}
main();
//# sourceMappingURL=utils.js.map