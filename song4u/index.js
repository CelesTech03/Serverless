const querystring = require('qs');
const fetch = require("node-fetch");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const queryObject = querystring.parse(req.body);
    // www.example.com?username=john&age=13
    // {username: 'john', age: '13'}

    const url = queryObject.MediaUrl0;
    // context.log(url);

    const resp = await fetch(url, {
        method: 'GET',
    });

    const data = await resp.arrayBuffer();

    const result = await analyzeImage(data, context);

    context.log(result);

    const age = result[0].faceAttributes.age;

    let id = '';
    if (age > 5 && age < 25) {
        id = 'GenZ';
    } else if (age > 24 && age < 41) {
        id = 'GenY';
    } else if (age > 40 && age < 57) {
        id = 'GenX';
    } else if (age > 56 && age < 76) {
        id = 'BabyBoomers';
    } else {
        id = 'Uknown';
    }

    // context.log(id);

    const songs = {
        GenZ: "https://open.spotify.com/track/0SIAFU49FFHwR3QnT5Jx0k?si=1c12067c9f2b4fbf",
        GenY: "https://open.spotify.com/track/1Je1IMUlBXcx1Fz0WE7oPT?si=a04bbdf6ec4948b9", 
        GenX: "https://open.spotify.com/track/4Zau4QvgyxWiWQ5KQrwL43?si=790d9e3ef2ed408d", 
        BabyBoomers: "https://open.spotify.com/track/4gphxUgq0JSFv2BCLhNDiE?si=1abb329f2dc24f50", 
        Unknown: "https://open.spotify.com/track/5ygDXis42ncn6kYG14lEVG?si=84b49b41d09d4d11",
    };

    const song = songs[id];

    const message = `We guessed you're part of this generation: ${id}! Happy listening! ${song}`;

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: message,
    };
};

async function analyzeImage(img, context) {
    const KEY = process.env['FACE_API_KEY'];
    const URI_BASE = process.env['FACE_API_URI'] + '/face/v1.0/detect';

    const params = new URLSearchParams({
        'returnFaceId': 'true',
        'returnFaceAttributes': 'age',
    });

    context.log(URI_BASE + "?" + params.toString());

    const resp = await fetch(URI_BASE + "?" + params.toString(), 
    {
        method: "POST",
        body: img,
        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-key': KEY,
        },
    });

    const data = await resp.json();
    return data;
}