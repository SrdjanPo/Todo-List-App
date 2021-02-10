let mainApp = {};
let uid = "";

(function () {
  let firebase = app_firebase;
  //let uid = null;
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      //User is signed in
      uid = user.uid;
      console.log("set id");
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
