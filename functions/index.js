var functions = require('firebase-functions');
var admin = require('firebase-admin');
 
console.log('No ar');

admin.initializeApp(functions.config().firebase);

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