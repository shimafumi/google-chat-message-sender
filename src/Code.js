/**
 * メッセージを送信します。
 * @param {String} webhookUrl 送信先のスペースのwebhookUrl
 * @param {Json} payload 送信するjson
 * @return {Json} 送信結果のレスポンス
 */
function send(webhookUrl, payload) {
  const options =
  {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  };
  return UrlFetchApp.fetch(webhookUrl, options);
}



/**
 * メッセージを送信します。
 * @param {String} webhookUrl 送信先のスペースのwebhookUrl
 * @param {String} text 送信するメッセージ
 * @return {Json} 送信結果のレスポンス
 */
function sendText(webhookUrl, text) {
  const payload =
  {
    "text": text
  };

  const options =
  {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  };

  return UrlFetchApp.fetch(webhookUrl, options);
}



/**
 * スレッドを指定してメッセージを送信します。
 * @param {String} webhookUrl 送信先のスペースのwebhookUrl
 * @param {String} threadName 形式：spaces/{spaceId}/threads/{threadId}
 * @param {String} text 送信したいメッセージ
 * @return {Json} 送信結果のレスポンス
 */
function sendTextToThread(webhookUrl, threadName, text) {
  const payload =
  {
    'text': text,
    'thread':
    {
      'name': threadName
    }
  };

  const options = {
    'myamethod': 'POST',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload)
  };

  return UrlFetchApp.fetch(webhookUrl + "&messageReplyOption=REPLY_MESSAGE_OR_FAIL", options);
}



/**
 * メッセージURLから送信時に利用できるthreadNameを作成します。
 * @param {String} url メッセージのURL　形式：https://chat.google.com/room/xxxxxx/xxxxxx/xxxxxxx
 * @return {String} 形式：spaces/{spaceId}/threads/{threadId}
 */
function buildThreadName(url) {

  const isGoogleChatMessageUrl = function (url) {
    const regex = new RegExp("^https://chat\.google\.com/room/.+/.+");
    return regex.test(url);
  }

  if (!isGoogleChatMessageUrl(url)) {
    throw new Error(url + " is not Google chat message URL.")
  }

  const temp = url.replace("https://chat.google.com/room/", "").split("/");
  spaceId = temp[0];
  threadId = temp[1];
  return "spaces/" + spaceId + "/threads/" + threadId;
}


/**
 * メッセージURLからspaceNameを作成します。
 * @param {String} url メッセージのURL　形式：https://chat.google.com/room/xxxxxx/xxxxxx/xxxxxxx
 * @return {String} 形式：spaces/{spaceId}
 */
function buildSpaceName(url) {

  const isGoogleChatMessageUrl = function (url) {
    const regex = new RegExp("^https://chat\.google\.com/room/.+/.+");
    return regex.test(url);
  }

  if (!isGoogleChatMessageUrl(url)) {
    throw new Error(url + " is not Google chat message URL.")
  }

  const temp = url.replace("https://chat.google.com/room/", "").split("/");
  spaceId = temp[0];
  return "spaces/" + spaceId;
}



/**
 * 送信時のレスポンスから送信したメッセージのスレッドのURLを作成します。
 * @param {Json} response メッセージ送信時のレスポンス
 * @return {String} 形式："https://chat.google.com/room/{spaceId}/{threadId};
 */
function buildThreadUrl(response) {
  //thread={name=spaces/AAAAIjVOJQ8/threads/gaksNaFcyVs}
  const thereadName = JSON.parse(response)["thread"]["name"].split('/');
  const spaceId = thereadName[1];
  const threadId = thereadName[3];
  return "https://chat.google.com/room/" + spaceId + "/" + threadId;
}