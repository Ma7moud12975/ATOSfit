import fs from 'fs';
const key = "AIzaSyCYSSno1zaKO9-s3zVetn9oKes_AhAdfqk";

async function test() {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "hi" }] }]
      })
    });
    const data = await res.json();
    fs.writeFileSync('response.json', JSON.stringify(data, null, 2));
  } catch(e) {
    console.error(e);
  }
}
test();
