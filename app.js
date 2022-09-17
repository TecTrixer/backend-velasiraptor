// Copyright 2021 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const express = require("express");
const pinoHttp = require("./utils/logging");

const app = express();
// const fs = require('fs')

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Hack-ZRH:H%40ck-2O22%21@nft-store.4y35cqd.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    if (err) {
        return console.log(err);
    }
    // const collection = client.db("backend").collection("nfts");
    // let map = new Map();
    // collection.find({}).forEach(elem => {
    //     let minter = elem.issuer;
    //     console.log(minter);
    //     if (!map.has(minter)) {
    //         map.set(minter, 1);
    //     } else {
    //         map.set(minter, map.get(minter) + 1);
    //     }
    // }).then(() => {
    //     console.log(map);
    //     let array = [];
    //     for ([key, value] of map.entries()) {
    //         array.push({ key: key, value: value });
    //     }
    //     array = array.sort(function(a, b) {
    //         return (a.value > b.value) ? -1 : ((b.value > a.value) ? 1 : 0)
    //     })
    //     console.log(array);

    // });
    // fs.readFile("/Users/constantin/dev/hackzurich/issuers.txt", "utf8", function(err, data) {
    //     if (err) {
    //         return console.log(err);
    //     }
    //     let x = data.split("\n");
    //     for (let i = 1; i < x.length - 1; i++) {
    //         let line = x[i];

    //         if (line[0] === "{") {
    //             continue;
    //         }
    //         let y = line.split(", ");
    //         let entry = { tokenID: y[0], issuer: y[1], owner: y[2] };
    //         let nextline = x[i + 1];
    //         if (nextline[0] === "{") {
    //             let adjnextline = nextline.replace(/'/g, '"');
    //             let metadata = JSON.parse(adjnextline);
    //             entry.metadata = metadata;
    //             // console.log(entry);
    //             // console.log(entry.metadata.attributes);
    //         } else {
    //             // console.log(entry);
    //         }
    //         collection.insertOne(entry).then((data) => {
    //             console.log(data);
    //         });

    //     }
    // })
});


// Use request-based logger for log correlation
app.use(pinoHttp);

// Example endpoint
app.get('/', async (req, res) => {
    // Use basic logger without HTTP request info
    // logger.info({ logField: 'custom-entry', arbitraryField: 'custom-entry' }); // Example of structured logging
    // Use request-based logger with log correlation
    console.log(req.body.txt);
    // req.log.info('Child logger with trace Id.'); // https://cloud.google.com/run/docs/logging#correlate-logs
    res.send('Hello World!');
});

app.post("/search", async (req, res) => {
    console.log(req.body);
    res.send("LOL");
});

module.exports = app;
