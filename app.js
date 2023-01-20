require('dotenv').config()
const request = require('request')
const express = require('express')
const app = express()


// Constantes Principales
const ZOOM_GET_AUTHCODE='https://zoom.us/oauth/token?grant_type=authorization_code&code=';
const ZOOM_AUTH='https://zoom.us/oauth/authorize?response_type=code&client_id='

const PORT=8000;
//ruta de acceso URL /
app.get('/', (req, res) => {
  /*
     condicional para saber si el AUTHCODE existe en objeto req.query,
      el usuario se sera enviado desde Zoom OAuth. Si no, ira a Zoom OAuth para la autentificacion
      
  */
  const authCode=req.query.code;
  if (authCode) {
      // Codigo para solicitar token de acceso 
      let url =  ZOOM_GET_AUTHCODE + authCode + '&redirect_uri=' + process.env.redirectURL;
      request.post(url, (error, response, body) => {
          // Parse response to JSON
          body = JSON.parse(body);
          const accessToken = body.access_token;
          const refreshToken = body.refresh_token;
          // Obtained access and refresh tokens
          console.log(`Zoom OAuth Access Token: ${accessToken}`);
          console.log(`Zoom OAuth Refresh Token: ${refreshToken}`);
          if(accessToken){
        // Utilice el token de acceso obtenido para autenticar las llamadas a la API
        // Enviar una solicitud para obtener su información de usuario utilizando el punto final /me
        // El contexto `/me` restringe una llamada API al usuario al que pertenece el token
        // Esto ayuda a realizar llamadas a puntos finales específicos del usuario en lugar de almacenar el ID de usuario

        let listUser = [];
        
        request.get('https://api.zoom.us/v2/users/me', (error, response, body) => {
            if (error) {
                console.log('API Response Error: ', error)
            } else {
                body = JSON.parse(body);

                if(body.display_name){
                    listUser.push({
                        imgPerfile: body.pic_url,
                        nameUser: body.display_name,
                    })
                    console.log(listUser)
                }

            }
        }).auth(null, null, true, body.access_token);

        
        request.get('https://api.zoom.us/v2/past_meetings/{MeetingsId}', (error, response, body) => {
            if (error) {
                console.log('API Response Error: ', error)
            } else {
                body = JSON.parse(body);

            
            if(body.id){
                listUser.push({
                    id: body.id,
                    topic: body.topic,
                    email: body.user_email,
                    nameUserWebinar: body.user_name
                })
            }
                    
                }

                res.send(`
                    <style>
                        @import url('https://fonts.googleapis.com/css?family=Open+Sans:400,600&display=swap');@import url('https://necolas.github.io/normalize.css/8.0.1/normalize.css');html {color: #232333;font-family: 'Open Sans', Helvetica, Arial, sans-serif;-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;}h2 {font-weight: 700;font-size: 24px;}h4 {font-weight: 600;font-size: 14px;}.container {margin: 24px auto;padding: 16px;max-width: 720px;}.info {display: flex;align-items: center;}.info>div>span, .info>div>p {font-weight: 400;font-size: 13px;color: #747487;line-height: 16px;}.info>div>span::before {content: "👋";}.info>div>h2 {padding: 8px 0 6px;margin: 0;}.info>div>p {padding: 0;margin: 0;}.info>img {background: #747487;height: 96px;width: 96px;border-radius: 31.68px;overflow: hidden;margin: 0 20px 0 0;}.response {margin: 32px 0;display: flex;flex-wrap: wrap;align-items: center;justify-content: space-between;}.response>a {text-decoration: none;color: #2D8CFF;font-size: 14px;}.response>pre {overflow-x: scroll;background: #f6f7f9;padding: 1.2em 1.4em;border-radius: 10.56px;width: 100%;box-sizing: border-box;}
                    </style>
                    <div class="container">
                        <div class="info">
                            <img src="${listUser[0].imgPerfile}" alt="User photo" />
                            <div>
                                <h2>${listUser[0].nameUser}</h2>
                            </div>
                        </div>
                        <div class="response">
                        <h1>Resumen de Reuniones ZOOM</h1>
                            <h2>${listUser[1].id}</h2>
                            <h2>${listUser[1].topic}</h2>
                            <h2>${listUser[1].email}</h2>
                            <h2>${listUser[1].nameUserWebinar}</h2>
                        </div>

                        
                    </div>
                `);

                console.log(listUser)

            }
        
        
        ).auth(null, null, true, body.access_token);
        
                
        }

        
        
    else{
        res.send('Something went wrong')
    }
    
      }).auth(process.env.clientID, process.env.clientSecret);
      return;
  }
  // Si no se obtiene ningún código de autenticación, redirija a Zoom OAuth para realizar la autenticación
  res.redirect(ZOOM_AUTH + process.env.clientID + '&redirect_uri=' + process.env.redirectURL)
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