// Для асинхронной работы используется пакет micro.
const { json } = require('micro');
const https = require('https');
// Запуск асинхронного сервиса.
module.exports = async (req, res) => {
    function httpGet() {
        return new Promise(((resolve, reject) => {
          var options = {
              host: 'api.thingspeak.com',
              path: '/channels/694587/feeds/last.json',
              port: 443,
              method: 'GET',
          };
          const request = https.request(options, (response) => {
            response.setEncoding('utf8');
            let returnData = '';
            //console.log(returnData);
            response.on('data', (chunk) => {
              returnData += chunk;
             // console.log(returnData);
            });
            response.on('end', () => {
              resolve(JSON.parse(returnData));
            });
            response.on('error', (error) => {
              reject(error);
            });
          });
          request.end();
        }));
      }   
    const response = await httpGet();
    // Из запроса извлекаются свойства request, session и version.
    const { request, session, version } = await json(req);
    console.log(`request ${JSON.stringify(request.command)}`);
    // В тело ответа вставляются свойства version и session из запроса.
    // Подробнее о формате запроса и ответа — в разделе Протокол работы навыка.
    let cmd = `Сейчас в офисе уровень CO2 ${response.field3} ppm, температура ${response.field1} градусов,
                    влажность ${response.field2} %` || 'Hello!';
    let session_value = false;
        request.command = request.command.toLowerCase();

    if (request.command === "помощь" ||  request.command === "что ты умеешь") {
        cmd = 'Я рассказываю только о качестве воздуха в офисе, спросите "Какое качество воздуха", и я перечислю вам данные с наших сенсоров';
        end_session = false;} 
    if (request.command !== "помощь" &&  request.command !== "что ты умеешь" &&  request.command !== ""  && request.command !== "какое качество воздуха"){
        cmd = 'Я не знаю такой команды, пожалуйста напишите "Помощь"';
        end_session = false;
        }
    res.end(JSON.stringify(
        { 
            version,
            session,
            response: {
                text: cmd,
                end_session: session_value,
            },
        }
    ));
};