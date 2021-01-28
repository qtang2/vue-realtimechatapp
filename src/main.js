import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase'

Vue.config.productionTip = false

// const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

var firebaseConfig = {
  apiKey: "AIzaSyCJVUfuld125dGmuRx_4U4QAdn_4yUK6CE",
  authDomain: "vue-realtimechatapp.firebaseapp.com",
  projectId: "vue-realtimechatapp",
  storageBucket: "vue-realtimechatapp.appspot.com",
  messagingSenderId: "542272461055",
  appId: "1:542272461055:web:6b35e5aeb54785edef54ca"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

//Make db accessible from everywhere
window.db = db;

//Disable deprecated features
db.settings({
  timestampsInSnapshots:true
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
