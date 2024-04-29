
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


