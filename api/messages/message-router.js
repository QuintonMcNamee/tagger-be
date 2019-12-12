// ****** DEPENDENCIES *********

require('dotenv').config()
const router = require("express").Router();
const axios = require("axios");
const {google} = require('googleapis');


const fs = require('fs');

// ********* COMMUNICATION STEP 1: POST FROM FE **********

router.post('/postfe', (req, res) => {
  
  let code = req.body.code;
  console.log(code);

  // res.status(200).json("TEST RESPONSE");

  axios.post('https://www.googleapis.com/oauth2/v4/token', {
      code: code,
      client_id: "498525641423-gv4h1poto9mdbdlj7qibo9sf0t4f2231.apps.googleusercontent.com",
      client_secret: "AGBziX-GP5CKEc9vckgr28I8",
      redirect_uri: "http://localhost:3000",
      grant_type: "authorization_code"
    })
    .then((res) => {
      // console.log(`statusCode: ${res.statusCode}`)
      console.log(res.data);

      // ******* MOVING COMMUNICATION STEP 2 TO HERE ************

      let token = res.data;

      fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Gmail API.
        authorize(JSON.parse(content), addLabels);
      });

      setTimeout(() => fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Gmail API.
        authorize(JSON.parse(content), listMessages);
      }), 2000);
      
      /**
       * Create an OAuth2 client with the given credentials, and then execute the
       * given callback function.
       * @param {Object} credentials The authorization client credentials.
       * @param {function} callback The callback to call with the authorized client.
      */
      
      function authorize(credentials, callback) {
        const {client_secret, client_id, redirect_uris} = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
          client_id, client_secret, redirect_uris[3]
        );
      
        oAuth2Client.setCredentials(token);
        callback(oAuth2Client);
      }
      // Adds tagger_Labels to user's Gmail account.
      function addLabels(auth) {
        const gmail = google.gmail({version: 'v1', auth});

        let taggerLabels = ["tagger_Finance", "tagger_Personal", "tagger_Productivity", "tagger_Promotions", "tagger_Security", "tagger_Shopping", "tagger_Social", "tagger_Other"]

        taggerLabels.map(label => {
          gmail.users.labels.create(
            {
              userId: "me",
              resource: {
                name: label,
                labelListVisibility: "labelHide",
                messageListVisibility: "hide"
              }
              
            }, (err, res) => {
              console.log('test', res);
              console.log('testerror', err);
            })
        })
      }
        function listMessages(auth) {
        const gmail = google.gmail({version: 'v1', auth});

        gmail.users.messages.list({
          userId: 'me',
        }, (err, res) => {
          if (err) return console.log('The API returned an error: ' + err);
          const messages = res.data.messages;
          if (messages.length) {
            messages.forEach((message) => {
              gmail.users.messages.get({
                userId: 'me',
                id: message.id,
              }, (err, res) => {
                // console.log(`\n ******************* \n ${res.data.id} \n ******************* \n`);
                // console.log(Buffer.from(res.data.payload.parts[0].body.data, 'base64').toString());
                // console.log(res.data.id);

                // if(res.data.payload.headers[0])
                let sender = res.data.payload.headers.find(sender => sender.name === 'From');
                // console.log('****** sender ******', sender.value);
              
                let subject = res.data.payload.headers.find(subject => subject.name === "Subject");
                // console.log('****** subject ******', subject.value);

                let message = Buffer.from(res.data.payload.parts[0].body.data, 'base64').toString();

                let dsObject = {
                  sender : sender.value,
                  id : res.data.id,
                  subject : subject.value,
                  message : "You've just won 1 million dollars!"
                }
                
                if(res.data.payload.parts !== undefined) {
                  let idPlaceHolder = res.data.id;
                  axios.post('http://tags2.us-east-2.elasticbeanstalk.com/api/tags', {
                    sender : sender.value,
                    id : res.data.id,
                    subject : subject.value,
                    message : message
                  })
                  
                  .then((res) => {
                    console.log(idPlaceHolder)
                    console.log(res.data.tag);

                    if(res.data.tag === "Finance") {
                      gmail.users.labels.list({
                        userId: 'me'
                      }, (err, res) => {
                        let finance = res.data.labels.find(finance => finance.name === 'tagger_Finance')
                        gmail.users.messages.modify({
                          userId: 'me',
                          id: idPlaceHolder,
                          resource: 
                          {
                            "addLabelIds": [
                              finance.id
                            ]
                          }
                        }), (err, res) => {
                          console.log(res)
                        }
                      })
                    }

                    if(res.data.tag === "Personal") {
                      gmail.users.labels.list({
                        userId: 'me'
                      }, (err, res) => {
                        let personal = res.data.labels.find(personal => personal.name === 'tagger_Personal')
                        gmail.users.messages.modify({
                          userId: 'me',
                          id: idPlaceHolder,
                          resource: 
                          {
                            "addLabelIds": [
                              personal.id
                            ]
                          }
                        }), (err, res) => {
                          console.log(res)
                        }
                      })
                    }

                    if(res.data.tag === "Productivity") {
                      gmail.users.labels.list({
                        userId: 'me'
                      }, (err, res) => {
                        let productivity = res.data.labels.find(productivity => productivity.name === 'tagger_Productivity')
                        gmail.users.messages.modify({
                          userId: 'me',
                          id: idPlaceHolder,
                          resource: 
                          {
                            "addLabelIds": [
                              productivity.id
                            ]
                          }
                        }), (err, res) => {
                          console.log(res)
                        }
                      })
                    }

                    if(res.data.tag === "Security") {
                      gmail.users.labels.list({
                        userId: 'me'
                      }, (err, res) => {
                        let security = res.data.labels.find(security => security.name === 'tagger_Security')
                        gmail.users.messages.modify({
                          userId: 'me',
                          id: idPlaceHolder,
                          resource: 
                          {
                            "addLabelIds": [
                              security.id
                            ]
                          }
                        }), (err, res) => {
                          console.log(res)
                        }
                      })
                    }

                    if(res.data.tag === "Social") {
                      gmail.users.labels.list({
                        userId: 'me'
                      }, (err, res) => {
                        let social = res.data.labels.find(social => social.name === 'tagger_Social')
                        gmail.users.messages.modify({
                          userId: 'me',
                          id: idPlaceHolder,
                          resource: 
                          {
                            "addLabelIds": [
                              social.id
                            ]
                          }
                        }), (err, res) => {
                          console.log(res)
                        }
                      })
                    }

                    if(res.data.tag === "Shopping") {
                      gmail.users.labels.list({
                        userId: 'me'
                      }, (err, res) => {
                        let shopping = res.data.labels.find(shopping => shopping.name === 'tagger_Shopping')
                        gmail.users.messages.modify({
                          userId: 'me',
                          id: idPlaceHolder,
                          resource: 
                          {
                            "addLabelIds": [
                              shopping.id
                            ]
                          }
                        }), (err, res) => {
                          console.log(res)
                        }
                      })
                    }

                    if(res.data.tag === "Promotions") {
                      gmail.users.labels.list({
                        userId: 'me'
                      }, (err, res) => {
                        let promotions = res.data.labels.find(promotions => promotions.name === 'tagger_Promotions')
                        gmail.users.messages.modify({
                          userId: 'me',
                          id: idPlaceHolder,
                          resource: 
                          {
                            "addLabelIds": [
                              promotions.id
                            ]
                          }
                        }), (err, res) => {
                          console.log(res)
                        }
                      })
                    }

                    if(res.data.tag === "Other") {
                      gmail.users.labels.list({
                        userId: 'me'
                      }, (err, res) => {
                        let other = res.data.labels.find(other => other.name === '9823fnb829fb')
                        gmail.users.messages.modify({
                          userId: 'me',
                          id: idPlaceHolder,
                          resource: 
                          {
                            "addLabelIds": [
                              other.id
                            ]
                          }
                        }), (err, res) => {
                          console.log(res)
                        }
                      })
                    }

                  })
                  .catch((error) => {
                    console.error(error)
                  })
                }
              })
            });
          } else {
            console.log('No messages found.');
          }
        })
      }
      })
      .catch((error) => {
        console.error(error)
      })
})

module.exports = router;
