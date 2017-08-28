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

      mailOptions.subject = 'Benvindo';
      mailOptions.text = 'Seja benvindo ao BaaS';
      return mailTransport.sendMail(mailOptions).then(() => {
        console.log('Enviado para:', event.data.email);
      }).catch(error => {
        console.error('Erro no envio de email:', error);  
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
 
        return admin.messaging().sendToTopic(topic, payload)
            .then(function (response) {
                console.log("Mensagem enviada com sucesso:", response);
            })
            .catch(function (error) {
                console.log("Erro ao enviar a mensagem:", error);
            });
        });