let mainApp = {};
let uid = "";

(function () {
  let firebase = app_firebase;
  //let uid = null;
  console.log(firebase);
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      //User is signed in
      uid = user.uid;
    } else {
      //Redirect to login page
      uid = null;
      window.location.replace("login.html");
    }
  });
  function logOut() {
    firebase.auth().signOut();
  }
  mainApp.logOut = logOut;
})();
