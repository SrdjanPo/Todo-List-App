let app_firebase = {};
(function() {
   // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyBQE0-3wjKXUVygBUwYmPSH7qHrxNe5lxs",
    authDomain: "todo-list-app-bd22d.firebaseapp.com",
    projectId: "todo-list-app-bd22d",
    storageBucket: "todo-list-app-bd22d.appspot.com",
    messagingSenderId: "268758218907",
    appId: "1:268758218907:web:2e6864b1935ae0ecf2ae3e",
    measurementId: "G-T0B5D5XT96"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  app_firebase = firebase;
})()