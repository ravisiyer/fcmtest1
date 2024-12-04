// Ravi: Based on https://github.com/hqdung99/firebase-cloud-messaging-test , 
// Push Notifications to Your Web Application in Browser Using Google Firebase (Cloud Messaging), 
// https://www.youtube.com/watch?v=w9_Q8bdjJng , around 9 mins., Jul. 2022
// but which gave me some npm install/start errors which I could not fix easily. 
// This project uses some of the above code's project but is a different project. 

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

console.log("Firebase messaging test")

const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);
onMessage(messaging, function(payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
      body: payload.notification.body, 
      icon: payload.notification.icon,        
  };
  console.log("Entered onMessage function handler")
  console.log(notificationTitle,notificationOptions)

  if (!("Notification" in window)) {
      console.log("This browser does not support system notifications.");
  } else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      var notification = new Notification(notificationTitle,notificationOptions);
      // Ravi: Have not fully understood the intent of the code below.
      // But have observed that if app is open but not in focus, when notification appears
      // on bottom right of monitor (on Windows 10), clicking it results in focus changing to app.
      // If app is not open (in any browser tab/window), when notification appears
      // on bottom right of monitor, clicking it results in app being opened in browser tab.
      notification.onclick = function(event) {
          event.preventDefault();
          window.open(payload.notification.click_action , '_blank');
          notification.close();
      }
  }
});


function requestPermission() {
    console.log('Requesting permission...');
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log("Notification permission granted.");

        getToken(messaging, { vapidKey: process.env.REACT_APP_VAPID_KEY }).then((currentToken) => {
            if (currentToken) {
              // Send the token to your server and update the UI if necessary
              console.log("currentToken: ", currentToken);
              // Ravi: For this test program, above currentToken has to be copy-pasted from this program's console window
              // into Firebase console 'Test on device' window as FCM Registration token for sending a test
              // notification to this program
            } else {
              // Show permission request UI
              console.log('No registration token available.');
              // console.log('No registration token available. Request permission to generate one.');
              // ...
            }
        }).catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
            // ...
        });
      } else {
        console.log("Do not have permission!");
      }
   })
  }

requestPermission();

