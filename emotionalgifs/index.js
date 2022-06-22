const multipart = require('parse-multipart');
const fetch = require('node-fetch')

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const boundary = multipart.getBoundary(req.headers['content-type']);
  
    // Assigns the body variable the correct value
    const body = req.body;

    // parses the body
    const parts = multipart.Parse(body, boundary);

    // module.exports function
    // analyzes the image
    const result = await analyzeImage(parts[0].data);

    let emotions = result[0].faceAttributes.emotion;
    let objects = Object.values(emotions);
    const main_emotion = Object.keys(emotions).find(key => emotions[key] === Math.max(...objects));

    context.res = {
        body: {
            main_emotion
        }
    };
    console.log(result)
    context.done(); 
}

async function analyzeImage(img) {
    //const subscriptionKey = process.env.SUBSCRIPTIONKEY;
    const subscriptionKey = '3c5629de3c5b445a95e463c5a55a1f73';
    //const uriBase = process.env.ENDPOINT + '/face/v1.0/detect';
    const uriBase = 'https://celisfaceapi.cognitiveservices.azure.com/' + '/face/v1.0/detect';
    let params = new URLSearchParams({
        'returnFaceId': 'true',
        'returnFaceAttributes': 'emotion'  //FILL IN THIS LINE
    })

    let resp = await fetch(uriBase + '?' + params.toString(), {
        method: 'POST',  // WHAT TYPE OF REQUEST?
        body: img,  // WHAT ARE WE SENDING TO THE API?
      	// ADD YOUR TWO HEADERS HERE
        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key' : subscriptionKey
        }
    })
    let data = await resp.json();
    
    return data; 
}