<template>
    <div class="container">
      <sign-out></sign-out>
    <h3 class=" text-center">Messaging Chat pageee</h3>
    <div class="messaging">
        <div class="inbox_msg">
            <div class="inbox_people">
              <div class="headind_srch">
                  <div class="recent_heading">
                  <h4>Recent</h4>
                  </div>
                  <div class="srch_bar">
                  <div class="stylish-input-group">
                      <input type="text" class="search-bar"  placeholder="Search" >
                      <span class="input-group-addon">
                      <button type="button"> <i class="fa fa-search" aria-hidden="true"></i> </button>
                      </span> </div>
                  </div>
              </div>
            <div class="inbox_chat">
              <div v-for="contact in allContacts" :key="contact.id" class="chat_list" :class="{active_chat: contact.id === activeChatId}" @click="displayChatHistory(contact)">
                <div class="chat_people">
                    <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
                    <div class="chat_ib">
                    <h5>{{contact.displayName}} <span class="chat_date">Dec 25</span></h5>
                    <p>Test, which is a new approach to have all solutions 
                        astrology under one roof.</p>
                    </div>
                </div>
              </div>
            </div>
            </div>

            <div class="mesgs">
            <div class="msg_history">
              
              <div v-for="messageObj in allMessages" :key="messageObj.id">
                <div v-if="messageObj.author !== authUser.displayName" class="incoming_msg">
                <div class="incoming_msg_img"> 
                  <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> 
                </div>
                <div class="received_msg">
                  <div class="received_withd_msg">
                    <p>{{messageObj.message}}</p>
                    <span class="time_date"> {{messageObj.createdAt}} | {{messageObj.author}}</span></div>
                </div>
              </div>
              <div v-else-if="messageObj.author === authUser.displayName" class="outgoing_msg">
                <div class="sent_msg">
                  <p>{{messageObj.message}}</p>
                    <span class="time_date"> {{messageObj.createdAt}} | {{messageObj.author}}</span></div>
              </div>
              </div>
                
                
            </div>
            <div class="type_msg">
                <div class="input_msg_write">
                <input @keyup.enter="sendMessage" v-model="message" type="text" class="write_msg" placeholder="Type a message" />
                <button @click="sendMessage" class="msg_send_btn" type="button"><i class="fa fa-paper-plane-o" aria-hidden="true"></i></button>
                </div>
            </div>
            </div>
        </div>
        
      
      
      
    </div></div>
</template>

<script>
import firebase from 'firebase'
import SignOut from '../components/SignOut'

export default {
  components:{'sign-out':SignOut},
    data(){
        return {
            message: null,
            allMessages: [],
            allContacts:[],
            authUser: {},
            reciever:{},
            activeChatId: "",
            chatHistory:[]
        }
    },
    methods:{
      displayChatHistory(receiverObj){
        console.log("display chat history ")
        console.log("receiver and sender are " + receiverObj.displayName + ",  " + this.authUser.displayName)
        this.receiver = receiverObj
        //set current active chat 
        this.activeChatId = this.receiver.id
        console.log("now active chat Id is " + this.receiver.id)
        
        //get all messages from current userto chatter
        db.collection('chat')
          .where("author", "==",this.authUser.displayName)
          .where("receiver", "==",receiverObj.displayName)
          .onSnapshot((querySnapshots)=>{
            let sentMsgs = []
            querySnapshots.forEach(doc=>{
              sentMsgs.push(doc.data())})
      
            this.allMessages = sentMsgs
            console.log("all msgs after fetching sennnnnnnnt msgs ", this.allMessages)


            //get all messages from current chatter to current user
            db.collection('chat')
              .where("author", "==",receiverObj.displayName)
              .where("receiver", "==",this.authUser.displayName)
              .onSnapshot((querySnapshots)=>{
                let receivedMsgs = []
                querySnapshots.forEach(doc=>{
                  receivedMsgs.push(doc.data())})
          
                this.allMessages = this.allMessages.concat(receivedMsgs)
                console.log("all msgs after fetching reccccccceiveddd msgs ", this.allMessages)

                //sort all messages by created data
                this.allMessages.sort((obj1,obj2)=>{
                  
                  if(Date.parse(obj1.createdAt) > Date.parse(obj2.createdAt)) return 1;
                  if(Date.parse(obj1.createdAt) < Date.parse(obj2.createdAt)) return -1;
                  return 0;
                })
                console.log("all msgs beeeeeefore ", this.allMessages)
                console.log("all msgs after sooooooooooooooort ", this.allMessages)
                
            })
          })


        
        // //get all messages from current chatter to current user
        // db.collection('chat')
        //   .where("author", "==",receiverObj.displayName)
        //   .where("receiver", "==",this.authUser.displayName)
        //   .onSnapshot((querySnapshots)=>{
        //     let receivedMsgs = []
        //     querySnapshots.forEach(doc=>{
        //       receivedMsgs.push(doc.data())})
      
        //     this.allMessages = this.allMessages.concat(receivedMsgs)
        //     console.log("all msgs after fetching reccccccceiveddd msgs ", this.allMessages)
        //   })
          
          

        

      },
      setActive(){
        this.activeChat = !this.activeChat
      },

      sendMessage(){
            // console.log('In saveMessage')
            //save message to firebase
            console.log("sender name  is "+this.authUser.displayName + " and receiver name is " + this.receiver.displayName + " and the message is " + this.message)
            db.collection('chat').add({
                message: this.message,
                createdAt: new Date().toUTCString(),
                author: this.authUser.displayName,
                receiver: this.receiver.displayName
            }).then(()=>{
                this.scrollToBottom();
            })
            this.message = null
            
        },
        fetchMessages(){
          console.log("fetch messages for current user " + this.authUser.displayName)
          let allMessages = []
          //fetch messages sent by current user
          let sentMsgs = []
          db.collection('chat')
            .where("author", "==",this.authUser.displayName)
            .onSnapshot((querySnapshots)=>{
              querySnapshots.forEach(doc=>{
                sentMsgs.push(doc.data())})
            })


          //fetch messages received by current user
          let receivedMsgs = []
          console.log("rrrrrrrrrrrrrrrr  ", typeof receivedMsgs)
          db.collection('chat')
            .where("receiver", "==",this.authUser.displayName)
            .onSnapshot((querySnapshots)=>{
              querySnapshots.forEach(doc=>{
                  receivedMsgs.push(doc.data())})
              

              // setTimeout(()=>{
              //     this.scrollToBottom()
              // },500)
            })

//TODO: the concat method not working , cannot get a complete array
          allMessages = [].concat(sentMsgs,receivedMsgs);
          console.log("sent msgggs type ", sentMsgs, "received msgs  ", typeof receivedMsgs)
          console.log("all messages  ", allMessages)
          this.allMessages = allMessages

          console.log("after fetching messages form db ", this.allMessages)
            
        },
        fetchContacts(){
          console.log('Fetch contacts')
          // console.log(this.authUser.uid)
          if(this.authUser.uid){
            // console.log('uid exxxxxxxxxxxxist  ' + this.authUser.uid)
            db.collection('contacts').doc(this.authUser.uid).collection('mycontacts').get()
              .then((mycontacts)=>{
                if(mycontacts){
                  let allContacts = []
                  mycontacts.forEach(d =>{
                    let contact = {
                      displayName: d.data().displayName,
                      id: d.id
                    }
                    allContacts.push(contact)
                  })
                  this.allContacts = allContacts
                  console.log('Get all my contacts')
                  console.log(this.allContacts)
                  
                }else{
                  console.log('No such docs')
                }
              })
          }else{
            console.log("uid not exist")
          }
          // db.collection('contacts')
        },
        scrollToBottom(){
            let box = document.querySelector('.msg_history');
            box.scrollTop = box.scrollHeight
        }
    },
    created(){
        firebase.auth().onAuthStateChanged((user)=>{
            console.log("created")
            if(user){
                this.authUser = user
                console.log("(this.authUser set to user ")
                // console.log(this.authUser)
                this.fetchContacts();
                // this.fetchMessages();

            }else{
                console.log("no auth user at all")
                this.authUser = {}
            }
        })
        // this.fetchMessages();
        
    },
    //Not allow user to enter the chat page if user is not authe
    beforeRouteEnter(to,from,next){
        next((vm) =>{
            firebase.auth().onAuthStateChanged((user)=>{
                if(user){
                    next()
                }else{
                    vm.$router.push('/login')
                }
            })
        })
    }
}
</script>

<style scoped>
.container{max-width:1170px; margin:auto;}
img{ max-width:100%;}
.inbox_people {
  background: #f8f8f8 none repeat scroll 0 0;
  float: left;
  overflow: hidden;
  width: 40%; border-right:1px solid #c4c4c4;
}
.inbox_msg {
  border: 1px solid #c4c4c4;
  clear: both;
  overflow: hidden;
}
.top_spac{ margin: 20px 0 0;}


.recent_heading {float: left; width:40%;}
.srch_bar {
  display: inline-block;
  text-align: right;
  width: 60%; padding:
}
.headind_srch{ padding:10px 29px 10px 20px; overflow:hidden; border-bottom:1px solid #c4c4c4;}

.recent_heading h4 {
  color: #05728f;
  font-size: 21px;
  margin: auto;
}
.srch_bar input{ border:1px solid #cdcdcd; border-width:0 0 1px 0; width:80%; padding:2px 0 4px 6px; background:none;}
.srch_bar .input-group-addon button {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  padding: 0;
  color: #707070;
  font-size: 18px;
}
.srch_bar .input-group-addon { margin: 0 0 0 -27px;}

.chat_ib h5{ font-size:15px; color:#464646; margin:0 0 8px 0;}
.chat_ib h5 span{ font-size:13px; float:right;}
.chat_ib p{ font-size:14px; color:#989898; margin:auto}
.chat_img {
  float: left;
  width: 11%;
}
.chat_ib {
  float: left;
  padding: 0 0 0 15px;
  width: 88%;
}

.chat_people{ overflow:hidden; clear:both;}
.chat_list {
  border-bottom: 1px solid #c4c4c4;
  margin: 0;
  padding: 18px 16px 10px;
}
.inbox_chat { height: 550px; overflow-y: scroll;}

.active_chat{ background:#ebebeb;}

.incoming_msg_img {
  display: inline-block;
  width: 6%;
}
.received_msg {
  display: inline-block;
  padding: 0 0 0 10px;
  vertical-align: top;
  width: 92%;
 }
 .received_withd_msg p {
  background: #ebebeb none repeat scroll 0 0;
  border-radius: 3px;
  color: #646464;
  font-size: 14px;
  margin: 0;
  padding: 5px 10px 5px 12px;
  width: 100%;
}
.time_date {
  color: #747474;
  display: block;
  font-size: 12px;
  margin: 8px 0 0;
}
.received_withd_msg { width: 57%;}
.mesgs {
  float: left;
  padding: 30px 15px 0 25px;
  width: 60%;
}

 .sent_msg p {
  background: #05728f none repeat scroll 0 0;
  border-radius: 3px;
  font-size: 14px;
  margin: 0; color:#fff;
  padding: 5px 10px 5px 12px;
  width:100%;
}
.outgoing_msg{ overflow:hidden; margin:26px 0 26px;}
.sent_msg {
  float: right;
  width: 46%;
}
.input_msg_write input {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  color: #4c4c4c;
  font-size: 15px;
  min-height: 48px;
  width: 100%;
}

.type_msg {border-top: 1px solid #c4c4c4;position: relative;}
.msg_send_btn {
  background: #05728f none repeat scroll 0 0;
  border: medium none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  font-size: 17px;
  height: 33px;
  position: absolute;
  right: 0;
  top: 11px;
  width: 33px;
}
.messaging { padding: 0 0 50px 0;}
.msg_history {
  height: 516px;
  overflow-y: auto;
}
</style>