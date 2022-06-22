const querystring = require('qs');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const queryObject = querystring.parse(req.body);
    // www.example.com?username=john&age=13
    // {username: 'john', age: '13'}

    const url = queryObject.MediaUrl0;
    context.log(url);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: url,
    };
}