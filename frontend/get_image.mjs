import https from 'https';
import fs from 'fs';

https.get('https://html.duckduckgo.com/html/?q=cama+nuvem+pet+fundo+branco', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/src="([^"]+\.jpe?g|[^"]+\.png|[^"]+preview[^"]+)"/i);
    if(match) {
        console.log(match[1]);
    } else {
        console.log("No match found");
    }
  });
}).on("error", (err) => console.log("Error: " + err.message));
