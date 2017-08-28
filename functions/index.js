var functions = require('firebase-functions');
var admin = require('firebase-admin');

const nodemailer = require('nodemailer');

const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(
    `smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);

console.log('No ar');

admin.initializeApp(functions.config().firebase);

exports.sendWelcomeEmail = functions.auth.user().onCreate(event => {
    console.log(event);

    const mailOptions = {
        from: '"Firebase Corp." <noreply@firebase.com>',
        to: event.data.email
      };

      // The user unsubscribed to the newsletter.
      mailOptions.subject = 'Benvindo';
      mailOptions.text = 'Seja benvindo ao BaaS';
      return mailTransport.sendMail(mailOptions).then(() => {
        console.log('enviado para:', event.data.email);
      }).catch(error => {
        console.error('There was an error while sending the email:', error);  
      });

});

exports.sendNotification = functions.database.ref('/tarefas/{tarefaId}')
        .onWrite(event => {
 
        var eventSnapshot = event.data;
        
        var str = eventSnapshot.child("descricao").val();
        
        console.log(str);
 
        var topic = "android";
        
        var payload = {
            data: {
                "titulo" : "Nova Tarefa",
                "descricao" : eventSnapshot.child("descricao").val()
            }
        };
 
        // Envia uma mensagem para dispositivos inscritos no tópico fornecido.
        return admin.messaging().sendToTopic(topic, payload)
            .then(function (response) {
                // See the MessagingTopicResponse reference documentation for the
                // contents of response.
                console.log("Mensagem enviada com sucesso:", response);
            })
            .catch(function (error) {
                console.log("Erro ao enviar a mensagem:", error);
            });
        });