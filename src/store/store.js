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
    authUser:{},
    defaultPhotoURL:"https://downtownvictoria.ca/app/uploads/2019/05/avatar-1.png",
    allContacts:[],
    chatHistory:[],
    activeChatter:{},
    foundUsers:[],
    findUserHintMsg:"",
    toDeleteContact:{}
  },
  mutations: {
    //mutations must have state as the first arg
    findUsers:(state,foundUsers) =>{
      state.findUserHintMsg = ""
      state.foundUsers = foundUsers
      //Only one result cound be found 
      if(state.foundUsers.length<1){
        state.findUserHintMsg = "Sorry, user not exist"
        console.log('Sorry, user not exist')
      }
      
    },    
    displayChatHistory: (state,chatHistory) =>{
      state.chatHistory = chatHistory
    },
    fetchContacts: (state,allContacts)=>{state.allContacts = allContacts}, 
    setActiveChatter:(state,activeChatter) =>{state.activeChatter = activeChatter},
    setAuthUser:(state,user)=>{state.authUser = user},
    setToDeleteContact: (state,toDeleteContact) =>{state.toDeleteContact = toDeleteContact},
    setFindUserHintMsg: (state,findUserHintMsg) =>{state.findUserHintMsg = findUserHintMsg},
    resetFoundUsers:(state)=>{state.foundUsers = []},
    resetFindUserHintMsg:(state)=>{state.findUserHintMsg = "" },
    resetToDeleteContact:(state)=>{state.toDeleteContact = {} },
    resetChatHistory:(state)=>{state.chatHistory = [] },
    resetActiveChatter:(state)=>{state.activeChatter = {} },
    signOut:(state)=>{
      state.authUser={}
      state.activeChatter = {}
      state.allContacts=[],
      state.chatHistory=[],
      state.foundUsers=[],
      state.findUserHintMsg="",
      state.toDeleteContact={}
    }
  },

  actions: {
    signOut:({commit})=>{
      firebase.auth().signOut()
              .then(()=>{
                commit('signOut')
                alert('Sign out successfully :)')              
              })
              .catch((err)=>{
                  console.log(err)
              })
    },
    //save message to firebase
    sendMessage:({state},message)=>{
      //Check if chose a chatter to send message
      if(Object.keys(state.activeChatter).length !== 0){
        state.db.collection('chat').add({
          message: message,
          createdAt: new Date().toUTCString(),
          author: state.authUser.displayName,
          receiver: state.activeChatter.displayName
        }).then(()=>{
          console.log("message sent :)")
        })
      }else{
        alert('Choose one chatter to start chatting :)')
      }
      
    },
    deleteContact:({commit,state})=>{
      if(state.activeChatter.displayName === state.toDeleteContact.displayName){
        commit('resetChatHistory')
        commit('resetActiveChatter')
      }
      console.log('wanna delete contact ' + state.toDeleteContact.id + " for current user "+ state.authUser.uid)

      db.collection("contacts").doc(state.authUser.uid).collection('mycontacts').doc(state.toDeleteContact.id).delete().then(function() {
        
        alert("Contact successfully deleted!")
        
        console.log("Document successfully deleted!");
      }).catch(function(error) {
          console.error("Error removing document: ", error);
      });
    },
    addContact:({state},userToAdd)=>{
      console.log('add this id '+  state.authUser.uid + "a new contact , which is " + userToAdd.id)
      //search in the db and then decide to add new contacts collection in db
      let curUserRef = state.db.collection("contacts").doc(state.authUser.uid)
      let newContactRef = curUserRef.collection('mycontacts').doc(userToAdd.id)

      newContactRef.get()
        .then((docSnapshot)=>{
          if(docSnapshot.exists){
            console.log("exist")
            alert("Contact already added")
          }else{
            console.log("not exist")
            newContactRef.set({
              displayName: userToAdd.displayName
            })
            .then(function() {
                alert("New contact added successfully")
                console.log("Document successfully written!");
                
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
            
          }
        })
    },
    findUsers: ({commit,state},userToFind)=>{
      console.log("we want to find userrrrr  " + userToFind)
      if(userToFind!==""){
        state.db.collection('users')
        .where("displayName","==",userToFind)
        .get()
        .then((users)=>{ 
          if(users){
                let foundUsers = []
                users.forEach(d =>{
                  let foundUser = {
                    id: d.id,
                    displayName: d.data().displayName,
                    email: d.data().email,
                    photoURL: d.data().photoURL
                  }
                  foundUsers.push(foundUser)
                })
                commit('findUsers',foundUsers)
                
              }else{
                console.log('Not found any user')
              }
        })
      }else{
        commit('setFindUserHintMsg',"Input username to find one :)")
      }
      
    },
    displayChatHistory:({commit, state},activeChatter) =>{
        //set current active chat,and clear current chat history 
        commit('setActiveChatter',activeChatter)
        commit('resetChatHistory')

        //get all messages from current user to chatter
        state.db.collection('chat')
          .where("author", "==",state.authUser.displayName)
          .where("receiver", "==",activeChatter.displayName)
          .onSnapshot((querySnapshots)=>{
            let sentMsgs = []
            querySnapshots.forEach(doc=>{
              let msgObj = doc.data()
              sentMsgs.push(msgObj)
            })

            //get all messages sent from current chatter to current user
            state.db.collection('chat')
              .where("author", "==",activeChatter.displayName)
              .where("receiver", "==",state.authUser.displayName)
              .onSnapshot((querySnapshots)=>{
                let receivedMsgs = []
                querySnapshots.forEach(doc=>{
                  let receivedMsgObj = doc.data()
                  receivedMsgs.push(receivedMsgObj)
                })
                
                let chatHistory = sentMsgs.concat(receivedMsgs)
                
                //sort all messages by created data
                chatHistory.sort((obj1,obj2)=>{                  
                  if(Date.parse(obj1.createdAt) > Date.parse(obj2.createdAt)) return 1;
                  if(Date.parse(obj1.createdAt) < Date.parse(obj2.createdAt)) return -1;
                  return 0;
                })
                commit('displayChatHistory',chatHistory)
                             
            })

            
          })

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
            commit('fetchContacts',allContacts)            
          }else{
              console.log('No such docs')
          }
        })
      }else{
        console.log("uid not exist")
      }
    },
    setAuthUser: ({commit},user) =>{
      commit('setAuthUser',user)
    },
    setToDeleteContact:({commit},toDeleteContact)=>{
      commit('setToDeleteContact',toDeleteContact)
    },
    resetFoundUsers:({commit})=>{commit('resetFoundUsers')},
    resetFindUserHintMsg:({commit})=>{commit('resetFindUserHintMsg')},
    resetToDeleteContact:({commit})=>{commit('resetToDeleteContact')},
  },
  modules: {
  }
})
