// ****** DEPENDENCIES *********
const router = require("express").Router();
const axios = require("axios");
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();
const rateLimit = require('axios-rate-limit');


// ******* GLOBAL VARIABLES **********
let responseLabels = "";
let messages = "";
const http = rateLimit(axios.create(), { maxRequests: 1, perMilliseconds: 1750 });
http.getMaxRPS();


// ********* POST FROM FE WITH USER'S LOGIN INFORMATION **********
router.post('/postfe', (req, res) => {

  let code = req.body.code;

  res.status(200).json("Successfully hit /postfe endpoint");

  axios.post('https://www.googleapis.com/oauth2/v4/token', {
    code: code,
    client_id: process.env.GOOGLE_CLIENT_ID, // GOOGLE_CLIENT_ID is from the heroku config vars
    client_secret: process.env.GOOGLE_CLIENT_SECRET, // GOOGLE_CLIENT_SECRET is from the heroku config vars
    redirect_uri: "postmessage",
    grant_type: "authorization_code"
  })
    .then((res) => {

      let token = res.data;

      // Authorize a client, then call the Gmail API.
      authorize(addLabels);
    
      // Authorize a client, then call the Gmail API.
      setTimeout(() => authorize(getLabels), 2000);

      // Authorize a client, then call the Gmail API.
      setTimeout(() => authorize(getMessageIds), 4000);

      // Authorize a client, then call the Gmail API.
      setTimeout(() => authorize(listMessages), 6000);

      // process.env.GOOGLE_CLIENT_ID and process.env.GOOGLE_CLIENT_SECRET are from the heroku config vars
      function authorize(callback) {
        const oAuth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "postmessage"
        );

        oAuth2Client.setCredentials(token);
        callback(oAuth2Client);

      }

      // Adds tagger_Labels to user's Gmail account
      function addLabels(auth) {
        const gmail = google.gmail({ version: 'v1', auth });
        let taggerLabels = ["tagger_Finance", "tagger_Entertainment", "tagger_Productivity", "tagger_Events", "tagger_Travel", "tagger_Shopping", "tagger_Social", "tagger_Other"]

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
              if (err) return err;
            })

        })

      }

      // Gets the newly added tagger_Labels from the user's Gmail account
      function getLabels(auth) {
        const gmail = google.gmail({ version: 'v1', auth });

        gmail.users.labels.list(
          {
            userId: 'me'
          }, (err, res) => {
            if (err) return err;
            responseLabels = res.data.labels;
          })
          
      }

      // GETs all messages from the user's Gmail account.
      // Makes a POST to DS API with those messages to get its tagger_Label.
      // Finally, updates those messages on the gmail API with the updated tagger_Label.
      function getMessageIds(auth) {
        const gmail = google.gmail({ version: 'v1', auth });

        gmail.users.messages.list({
          userId: 'me',
        }, (err, res) => {
          if (err) return 'The API returned an error: ' + err;
          messages = res.data.messages;
        })
        
      }

      function listMessages(auth) {
        const gmail = google.gmail({ version: 'v1', auth });

        if (messages.length) {
          messages.forEach((message) => {
            gmail.users.messages.get({
              userId: 'me',
              id: message.id,
            }, (err, res) => {
              if (err) return err;
              let payload = res.data.payload
              let idPlaceHolder = res.data.id;

              let sender = payload.headers.find(sender => sender.name === 'From');


              let subject = payload.headers.find(subject => subject.name === "Subject");


              if (payload.parts !== undefined) {
                let message = Buffer.from(payload.parts[0].body.data, 'base64').toString();
                
                http.post('http://LstmModel-env.4zqtqnkaex.us-east-1.elasticbeanstalk.com/api/tags', {
                  sender: sender.value,
                  id: idPlaceHolder,
                  subject: subject.value,
                  message: message,
                 

                })

                  .then((res) => {
                    console.log(idPlaceHolder)
                    console.log(res.data.tag);
                    let dataTag = res.data.tag;



                    dataTag.forEach(tag => {



                      if (tag === "Finance") {
                        let finance = responseLabels.find(finance => finance.name === 'tagger_Finance')
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
                          if (err) return err;
                          console.log(res)
                        }
                      }

                      if (tag === "Entertainment") {
                        let entertainment = responseLabels.find(entertainment => entertainment.name === 'tagger_Entertainment')
                        gmail.users.messages.modify({
                          userId: 'me',
                          id: idPlaceHolder,
                          resource:
                          {
                            "addLabelIds": [
                              entertainment.id
                            ]
                          }
                        }), (err, res) => {
                          if (err) return err;
                          console.log(res)
                        }
                      }

                      if (tag === "Productivity") {
                        let productivity = responseLabels.find(productivity => productivity.name === 'tagger_Productivity')
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
                          if (err) return err;
                          console.log(res)
                        }
                      }

                      if (tag === "Events") {
                        let events = responseLabels.find(events => events.name === 'tagger_Events')
                        gmail.users.messages.modify({
                          userId: 'me',
                          id: idPlaceHolder,
                          resource:
                          {
                            "addLabelIds": [
                              events.id
                            ]
                          }
                        }), (err, res) => {
                          if (err) return err;
                          console.log(res)
                        }
                      }

                      if (tag === "Travel") {
                        let travel = responseLabels.find(travel => travel.name === 'tagger_Travel')
                        gmail.users.messages.modify({
                          userId: 'me',
                          id: idPlaceHolder,
                          resource:
                          {
                            "addLabelIds": [
                              travel.id
                            ]
                          }
                        }), (err, res) => {
                          if (err) return err;
                          console.log(res)
                        }
                      }

                      if (tag === "Shopping") {
                        let shopping = responseLabels.find(shopping => shopping.name === 'tagger_Shopping')
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
                          if (err) return err;
                          console.log(res)
                        }
                      }

                      if (tag === "Social") {
                        let social = responseLabels.find(social => social.name === 'tagger_Social')
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
                          if (err) return err;
                          console.log(res)
                        }
                      }

                      if (tag === "Other") {
                        let other = responseLabels.find(other => other.name === 'tagger_Other')
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
                          if (err) return err;
                          console.log(res)
                        }


                      }

                    })


                  })
                  .catch((error) => {
                    console.error(error)
                  })
              }
            });
          });
        } else {
          return 'No messages found.';
        }



      }
    })
    .catch((error) => {
      console.error(error)
    })
})

module.exports = router;