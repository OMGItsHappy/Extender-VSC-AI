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



async function fetchData(url: string): Promise<string> {
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
    } catch (error) {
      console.error('Error:', error.message);
      throw new Error('Failed to process data.'); // Propagate the error
    }
  }
  
  async function main() {
    try {
      await processData();
      console.log('Processing complete.');
    } catch (error) {
      console.error('Main Error:', error.message);
    }
  }
  
  main();