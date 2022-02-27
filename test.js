const fs = require("fs");

const network = '1337'

fs.readFile('./config.json', 'utf-8', (err, jsonString) => {
    if(err) {
        console.log(err)
    } else {
        try {
            const data = JSON.parse(jsonString)
            console.log(data[network])
        } catch (err) {
            console.log('Error passing JSON: ', err)
        }
    }
})