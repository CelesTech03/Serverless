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

    context.log(id);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: id,
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