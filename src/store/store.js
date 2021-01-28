import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'

Vue.use(Vuex)

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
var db = firebase.firestore()
db.settings({
  timestampsInSnapshots:true
})

export const store = new Vuex.Store({
  state: {
    db: db,
    authUser:null,
    defaultPhotoURL:"https://downtownvictoria.ca/app/uploads/2019/05/avatar-1.png",
    chatHistory:['kdkdkddk'],
    allContacts:[]
  },
  mutations: {
    //mutations must have state as the first arg 
    setAuthUser:function (state,user){
      console.log("in Mutation set Auth User ", user)
      state.authUser = user
    },
    fetchContacts: (state,allContacts)=>{
      console.log("in Mutation fetch ", allContacts)
      state.allContacts = allContacts
    }
  },
  actions: {
    setAuthUser: ({commit,state},user) =>{
      console.log(state.chatHistory)
      commit('setAuthUser',user)
    },
    fetchContacts: ({commit,state}) =>{
      if(state.authUser.uid){
        db.collection('contacts').doc(state.authUser.uid).collection('mycontacts').onSnapshot((querySnapshots)=>{
          
          if(querySnapshots){
            let allContacts = []
            querySnapshots.forEach(d =>{
              db.collection('users').doc(d.id).get()
                .then(user => {
                    if (user.exists) {
                        let contact = {
                          displayName: user.data().displayName,
                          id: d.id,
                          email: user.data().email,
                          photoURL: user.data().photoURL ? user.data().photoURL: state.defaultPhotoURL
                        }
                        allContacts.push(contact)
                    } else {
                        console.log("No such user!");
                    }
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                });
              })
            // state.allContacts = allContacts
            commit('fetchContacts',allContacts)
            
          }else{
              console.log('No such docs')
          }
        })
      }else{
        console.log("uid not exist")
      }
    }
  },
  modules: {
  }
})
