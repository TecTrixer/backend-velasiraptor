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

const express = require('express');
const { pinoHttp, logger } = require('./utils/logging');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Hack-ZRH:H%40ck-2O22%21@nft-store.4y35cqd.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const minters = client.db("backend").collection("valid_minters");
const nfts = client.db("backend").collection("nfts");

const app = express();

// Use request-based logger for log correlation
app.use(pinoHttp);
app.use(bodyParser.text({ extended: true }));
app.use(cors());

// Example endpoint
app.get('/', async (_, res) => {
    // Use basic logger without HTTP request info
    // logger.info({logField: 'custom-entry', arbitraryField: 'custom-entry'}); // Example of structured logging
    // Use request-based logger with log correlation
    // req.log.info('Child logger with trace Id.'); // https://cloud.google.com/run/docs/logging#correlate-logs
    res.send('Hi, there!');
});

app.post('/search', async (req, res) => {
    let search = req.body;
    logger.info(search);
    let response = { "err": "Not implemented yet" };
    isUrl(search).then(async () => {
        let tokenID = getTokenId(search);
        response = await validateNFT(tokenID);
    }).catch(async (_) => {
        response = await getNFTs(search);
    }).finally(_ => {
        res.send(response);
    });
})

// https://sparkies.io/nft/0x948E8c6E0c9035f7372a10e10f9f71cC81341053/8172
function isUrl(a) {
    if (a.slice(0, 5) === "https") {
        return new Promise((resolve, _) => {
            resolve();
        });
    } else {
        return new Promise((_, reject) => {
            reject();
        });
    }
}

function getTokenId(a) {
    logger.info(a);
    let split = a.split("/");
    return split[5];
}

async function validateNFT(tokenId) {
    let res = { "err": "Wrong URL" };
    try {
        let elem = await nfts.findOne({ tokenID: tokenId });
        let issuer = elem.issuer;
        try {
            let cert = await minters.findOne({ key: issuer });
            console.log(cert);
            elem.valid = true;
            elem.creator = cert.value;
        } catch (_) {
            elem.valid = false;
        }
        res = elem;
    } catch (e) {
        console.log(e);
    }
    console.log(res);
    return res;
}

async function getNFTs(search) {
    let res = { "err": "Could not do a full text search" };
    try {
        let find = nfts.aggregate([
            {
                '$search': {
                    'index': 'fulltextindex',
                    'text': {
                        'query': search,
                        'path': {
                            'wildcard': '*'
                        }
                    }
                }
            }
        ]);
        let limit = find.limit(30);
        let list = await limit.toArray();
        let resarr = [];
        for (let nft of list) {
            resarr.push(await validateNFT(nft.tokenID));
        }
        res = resarr;
    } catch (e) {
        console.log(e);
        logger.info(e);
    } finally {
        return res;
    }
}

module.exports = app;
