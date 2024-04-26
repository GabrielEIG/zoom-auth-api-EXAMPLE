// 
// const express = require('express')
// const app = express()
// const path = require('path');
// const bodyParser = require('body-parser');

// import { DeleteMeeting } from "./functions/meeting/meetings/delete/meeting";
// import { GetListMeeting } from "./functions/meeting/meetings/get/listMeeting";

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());



// const {getToken} = require('./functions/tokenAccess')
// const {GetUser} = require('./functions/users/user/getUser')
// const {GetMeeting} = require('./functions/meeting/meetings/get/meeting')
// const {CreateMeet} = require('./functions/meeting/meetings/post/createMeeting')



// // Constantes Principales

// const clientID = process.env.clientID;
// const clientSecret = process.env.clientSecret;
// const meetingID = process.env.meetingID;
// const PORT=8000;
// const redirectURL = process.env.redirectURL;

// //ruta de acceso URL /


// app.get('/', async (req: any, res: any) => {
//   try {
//     const tokenAccess = await getToken(req, res,
//       redirectURL,
//       clientID,
//       clientSecret
//   );

//     res.send(tokenAccess)
    
//   } catch (error) {
//     res.status(500).send('Internal Server Error'); 
//   }
// });


// app.get('/meeting', async (req:any, res:any) => {

//   const newRedirectURL = redirectURL + 'meeting'

//   try {
//     let a = await GetMeeting({req: req, res: res,
//       redirectURL: newRedirectURL ,
//       clientID : clientID,
//       clientSecret: clientSecret,
//       meetingID: meetingID}
//       );

//     res.send(a)
    
//   } catch (error) {
//     res.status(500).send('Internal Server Error'); 
//   }

// })


// app.get('/meeting/create', async (req:any, res:any) => {

//   try {

//     res.sendFile(path.join(__dirname, 'index.html'));
    
//   } catch (error) {
//     res.status(500).send('Internal Server Error'); 
//   }

// })



// app.post('/meeting/create', async (req:any, res:any) => {

//   let newRedirectURL = redirectURL + 'meeting/create';

//   const { topic, type, start_time, duration, timezone, agenda, settings } = req.body;

//   const meeting = {
//     topic: topic,
//     type: parseInt(type),
//     start_time: start_time,
//     duration: parseInt(duration),
//     timezone: timezone,
//     agenda: agenda,
//     settings: settings
// };
// console.log("bien 1")

//   try {

//     await CreateMeet({req: req, res: res,
//       redirectURL: newRedirectURL ,
//       clientID : clientID,
//       clientSecret: clientSecret,
//       meeting: meeting});

//       res.send("klk")
//     // res.sendFile(path.join(__dirname, 'index.html'));
    
//   } catch (error) {
//     res.status(500).send('Internal Server Error'); 
//   }

// })


// app.listen(PORT, () => console.log(`Zoom OAuth NodeJS App started on port ${PORT}`))

















require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
import {CreateMeeting,
  CreateMeetingLink,
  CreateMeetingTemplate,
  GetMeeting,
  GetMeetingLinkInvitation,
  GetToken,
  GetUser,
  UpdateMeeting} from 'zoom-auth-api'


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Constantes Principales
const authCode = process.env.TOKEN;
const clientID = process.env.clientID;
const clientSecret = process.env.clientSecret;
const meetingId = process.env.meetingID;
const PORT=8000;
const redirectURL = process.env.redirectURL;

//ruta de acceso URL /


app.get('/', async (req: any, res: any) => {
  const code = req.query.code;
  console.log(code)
  try{
      
      res.send(code);    
  }catch(error){
      res.send('Error');
  }
});

app.get('/auth/zoom',async (req: any, res: any)=>{
  const redirect = redirectURL + "auth/zoom";
  const clientId = clientID ?? "";
  try{
    let a = await GetToken({
      res: res,
      req:req,
      redirectURL: redirect,
      clientSecret: clientSecret ?? "",
      clientID: clientId
    })
    res.send(a);    
  }
  catch (error) {
    res.status(500).send('Internal Server Error'); 
  }
  
});

app.get('/user', async (req:any, res:any) => {


  try {
    let user = await GetUser({
      authCode: authCode|| ""
    });

    res.send(user)
    
  } catch (error) {
    res.status(500).send('Internal Server Error'); 
  }

})

app.get('/meeting', async (req:any, res:any) => {

  try {
    let meeting = await GetMeeting({
      authCode: authCode ?? "0",
      meetingId: meetingId ?? "0"
      }
      );

    res.send(meeting)
    
  } catch (error) {
    res.status(500).send('Internal Server Error'); 
  }

})

app.get('/meeting/:id', async (req:any, res:any) => {


  try {

      res.sendFile(path.join(__dirname, 'index.html'));
    
  } catch (error) {
    res.status(500).send('Internal Server Error'); 
  }

})

app.post('/meeting/:id', async (req:any, res:any) => {

  const { topic, type, start_time, duration, timezone, agenda, settings } = req.body;

  const meeting = {
    id: "id of the meeting",
    topic: topic,
    type: parseInt(type),
    start_time: start_time,
    duration: parseInt(duration),
    timezone: timezone,
    agenda: agenda,
    settings: settings
};
  try {

    await UpdateMeeting({
      authCode: authCode ?? "0",
      meeting: meeting,
      meetingId: meetingId ?? "0",
      }
      );

      res.sendFile(path.join(__dirname, 'index.html'));
    
  } catch (error) {
    res.status(500).send('Internal Server Error'); 
  }

})

app.get('/meeting/create', async (req:any, res:any) => {

  try {

    res.sendFile(path.join(__dirname, 'index.html'));
    
  } catch (error) {
    res.status(500).send('Internal Server Error'); 
  }

})

app.post('/meeting/create', async (req:any, res:any) => {


  const { topic, type, start_time, duration, schedule_for, timezone, agenda, settings } = req.body;

  const meeting = {
    id: meetingId,
    topic: topic,
    type: parseInt(type),
    start_time: start_time,
    schedule_for: schedule_for,
    duration: parseInt(duration),
    timezone: timezone,
    agenda: agenda,
    settings: settings
};
  try {

    await CreateMeeting({
      authCode: authCode || "0",
      meeting: meeting,
    });

      res.sendFile(path.join(__dirname, 'index.html'));
    
  } catch (error) {
    res.status(500).send('Internal Server Error'); 
  }

})

app.get('/meeting/template', async (req:any, res:any) => {

  
  try {

    res.sendFile(path.join(__dirname, 'index.html'));
    
  } catch (error) {
    res.status(500).send('Internal Server Error'); 
  }

})

app.post('/meeting/template', async (req:any, res:any) => {
  
  const meetingTemplateExample = {
    "meeting_id": parseInt(meetingId ?? "0"),
    "name": "My Meeting Template01",
    "save_recurrence": false,
    "overwrite": false
  };
  
  try {
    const user = await GetUser({authCode: authCode ?? "0"})
    
    await CreateMeetingTemplate({authCode: authCode ?? "0",
      userId: user.id,
      meetingTemplate: meetingTemplateExample});

    res.sendFile(path.join(__dirname, 'index.html'));

  } catch (error) {
    res.status(500).send('Internal Server Error'); 
  }

})

app.get('/meeting/invite_links', async (req:any, res:any) => {

  
  try {
    

    let meeting = await GetMeetingLinkInvitation({
      authCode: authCode ?? "0",
      meetingId: meetingId ?? "0",
      }
      );

    res.send(meeting)
    
  } catch (error) {
    res.status(500).send('Internal Server Error'); 
  }

})

app.post('/meeting/invite_links', async (req:any, res:any) => {

  
  try {
    const meetingLinkExample = {
      "attendees": [
        {
          "name": "Jill Chill"
        }
      ],
      "ttl": 1000
    };
    await CreateMeetingLink({authCode: authCode ?? "0",
      meetingId: parseInt(meetingId ?? "0"),
      meetingLink: meetingLinkExample});

      res.sendFile(path.join(__dirname, 'index.html'));

    
  } catch (error) {
    res.status(500).send('Internal Server Error'); 
  }

})



app.listen(PORT, () => console.log(`Zoom OAuth NodeJS App started on port ${PORT}`))
































// request.get('https://api.zoom.us/v2/webinars/6696317824/registrants', (error, response, body) => {
//             if (error) {
//                 console.log('API Response Error: ', error)
//             } else {
//                 body = JSON.parse(body);

//                 if(body.registrants){
//                     let registrants = body.registrants;

//                     registrants.filter((x) => {listUser.push({
//                         email: x.email,
//                         nameUserWebinar: x.first_name,
//                         lastNameUserWebinar: x.last_name
//                     })} )
//                     console.log(listUser)
//                 }

//             }
//         }).auth(null, null, true, body.access_token);

//         request.get('https://api.zoom.us/v2/past_webinars/6696317824/participants', (error, response, body) => {
//             if (error) {
//                 console.log('API Response Error: ', error)
//             } else {
//                 body = JSON.parse(body);

            
//             if(body.permissions){
//                     listUser.push({
//                         permissions: body.participants,
//                         totalParticipants: body.total_records
//                     })
                    
//                 }

//                 // res.send(`
//                 //     <style>
//                 //         @import url('https://fonts.googleapis.com/css?family=Open+Sans:400,600&display=swap');@import url('https://necolas.github.io/normalize.css/8.0.1/normalize.css');html {color: #232333;font-family: 'Open Sans', Helvetica, Arial, sans-serif;-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;}h2 {font-weight: 700;font-size: 24px;}h4 {font-weight: 600;font-size: 14px;}.container {margin: 24px auto;padding: 16px;max-width: 720px;}.info {display: flex;align-items: center;}.info>div>span, .info>div>p {font-weight: 400;font-size: 13px;color: #747487;line-height: 16px;}.info>div>span::before {content: "👋";}.info>div>h2 {padding: 8px 0 6px;margin: 0;}.info>div>p {padding: 0;margin: 0;}.info>img {background: #747487;height: 96px;width: 96px;border-radius: 31.68px;overflow: hidden;margin: 0 20px 0 0;}.response {margin: 32px 0;display: flex;flex-wrap: wrap;align-items: center;justify-content: space-between;}.response>a {text-decoration: none;color: #2D8CFF;font-size: 14px;}.response>pre {overflow-x: scroll;background: #f6f7f9;padding: 1.2em 1.4em;border-radius: 10.56px;width: 100%;box-sizing: border-box;}
//                 //     </style>
//                 //     <div class="container">
//                 //         <div class="info">
//                 //             <img src="${listUser[0].imgPerfile}" alt="User photo" />
//                 //             <div>
//                 //                 <h2>${listUser[0].nameUser}</h2>
//                 //             </div>
//                 //         </div>
//                 //         <div class="response">
//                 //         <h1>Webinar registrants</h1>
//                 //             <p>${listUser[1].email}</p>
//                 //             <h2>${listUser[1].nameUserWebinar}</h2>
//                 //             <h2>${listUser[1].lastNameUserWebinar}</h2>
//                 //         </div>
//                 //         <div class="response">
//                 //         <h1>Past Webinar Participants</h1>
//                 //             <p>${listUser[2].participants}</p>
//                 //             <h2>${listUser[2].totalParticipants}</h2>
//                 //         </div>

                        
//                 //     </div>
//                 // `);

//                 console.log(listUser)

//             }

            
//         }).auth(null, null, true, body.access_token);














// request.get('https://api.zoom.us/v2/webinars/6696317824/registrants', (error, response, body) => {
//             if (error) {
//                 console.log('API Response Error: ', error)
//             } else {
//                 body = JSON.parse(body);

//                 if(body.registrants){
//                     let registrants = body.registrants;

//                     registrants.filter((x) => {listUser.push({
//                         email: x.email,
//                         nameUserWebinar: x.first_name,
//                         lastNameUserWebinar: x.last_name
//                     })} )
//                     console.log(listUser)
//                 }

//             }
//         }).auth(null, null, true, body.access_token);

//         request.get('https://api.zoom.us/v2/past_webinars/6696317824/participants', (error, response, body) => {
//             if (error) {
//                 console.log('API Response Error: ', error)
//             } else {
//                 body = JSON.parse(body);

            
//             if(body.permissions){
//                     listUser.push({
//                         permissions: body.participants,
//                         totalParticipants: body.total_records
//                     })
                    
//                 }

//                 // res.send(`
//                 //     <style>
//                 //         @import url('https://fonts.googleapis.com/css?family=Open+Sans:400,600&display=swap');@import url('https://necolas.github.io/normalize.css/8.0.1/normalize.css');html {color: #232333;font-family: 'Open Sans', Helvetica, Arial, sans-serif;-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;}h2 {font-weight: 700;font-size: 24px;}h4 {font-weight: 600;font-size: 14px;}.container {margin: 24px auto;padding: 16px;max-width: 720px;}.info {display: flex;align-items: center;}.info>div>span, .info>div>p {font-weight: 400;font-size: 13px;color: #747487;line-height: 16px;}.info>div>span::before {content: "👋";}.info>div>h2 {padding: 8px 0 6px;margin: 0;}.info>div>p {padding: 0;margin: 0;}.info>img {background: #747487;height: 96px;width: 96px;border-radius: 31.68px;overflow: hidden;margin: 0 20px 0 0;}.response {margin: 32px 0;display: flex;flex-wrap: wrap;align-items: center;justify-content: space-between;}.response>a {text-decoration: none;color: #2D8CFF;font-size: 14px;}.response>pre {overflow-x: scroll;background: #f6f7f9;padding: 1.2em 1.4em;border-radius: 10.56px;width: 100%;box-sizing: border-box;}
//                 //     </style>
//                 //     <div class="container">
//                 //         <div class="info">
//                 //             <img src="${listUser[0].imgPerfile}" alt="User photo" />
//                 //             <div>
//                 //                 <h2>${listUser[0].nameUser}</h2>
//                 //             </div>
//                 //         </div>
//                 //         <div class="response">
//                 //         <h1>Webinar registrants</h1>
//                 //             <p>${listUser[1].email}</p>
//                 //             <h2>${listUser[1].nameUserWebinar}</h2>
//                 //             <h2>${listUser[1].lastNameUserWebinar}</h2>
//                 //         </div>
//                 //         <div class="response">
//                 //         <h1>Past Webinar Participants</h1>
//                 //             <p>${listUser[2].participants}</p>
//                 //             <h2>${listUser[2].totalParticipants}</h2>
//                 //         </div>

                        
//                 //     </div>
//                 // `);

//                 console.log(listUser)

//             }

            
//         }).auth(null, null, true, body.access_token);