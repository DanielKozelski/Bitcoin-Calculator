const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.post('/', function(req, res){
    //check the user's choice
    let amount = req.body.amount
    let currency = req.body.currency;
    let url = `https://api.coindesk.com/v1/bpi/currentprice/${currency}.json`;
    //get bitcoin rates from external API
    request(url, function(error, response, body){
        console.log("Status Message: ", response.statusMessage);      
        console.log("Server Status Code: ", response.statusCode);
        //server response (the data we actually need)
        console.log(response.body);

        //convert response string to json object
        let data = JSON.parse(response.body);
        let price;

        if(currency === "EUR"){
            price = data.bpi.EUR.rate;
            console.log("Price in EUR ", price);
        } else {
            price = data.bpi.USD.rate;
            console.log("Price in USD ", price);
        }
        
        let disclaimer = data.disclaimer;
        
        //koma eemaldamine ja summa arvutamine
        price = price.replace(",","")
        price = parseFloat(price) * parseFloat(amount)

        res.write(`${disclaimer}`);
        res.write("<br>");
        res.write(`Current price in ${currency} for ${amount} bitcoin is ${price}`);
        res.send();

        
    });


});


app.listen(12000, function(){
    console.log("Server is running on port 12000");
});