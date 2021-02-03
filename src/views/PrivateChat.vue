<template>
    <div class="container">
      <sign-out></sign-out>
      <div v-if="showDeleteModal" class="delete_contact_container" >          
          <delete-contact-modal  @closeDeleteModal="closeDeleteModal" />
      </div>
      <div class="messaging" :class="{hide_page: showDeleteModal}" >        
        <div class="inbox_msg">
            <div class="inbox_people">
              <div class="heading_srch">
                  <div class="recent_heading">
                  <h4>Contacts</h4>
                  </div>
                  <div class="srch_bar">
                    <div class="stylish-input-group">
                        <input @keyup="searchContact" v-model="searchText" type="text" class="search-bar"  placeholder="Search " >
                        <span class="input-group-addon">
                        <button type="button"> <i class="fa fa-search" aria-hidden="true"></i> </button> 
                        
                        </span> 
                    </div>
                    <button  @click="showAddModal=true" class="add_contact_btn" type="button"><i class="fa fa-user-plus" aria-hidden=true></i></button>
                    
                  </div>
              </div>
            <div v-if="searching" class="inbox_chat">
              <div v-for="contact in searchResults" :key="contact.id" class="chat_list" :class="{active_chat: contact.id === activeChatter.id}" @click="displayChatHistory(contact)">
                <div class="chat_people">
                    <div class="chat_img"> <img :src="contact.photoURL" alt="profile image"> </div>
                    <div class="chat_ib">
                      <h5>{{contact.displayName}}</h5>
                      <p>Click to start chatting</p>
                    </div>
                </div>
              </div>
            </div>
            <div v-else class="inbox_chat">
                <div  v-if="showAddModal" class="add_contact_container">
                  <add-contact-modal  @closeModal="closeModal" />
                </div>
                <div v-else-if="allContacts.length===0">
                  <p>No contacts :O </p>
                  <p>Add contact to start chatting, e.g. Qian Tang</p>
                </div>
                <div v-else v-for="contact in allContacts" :key="contact.id" @mousedown="startTiming" @mouseup="endTiming(contact)" class="chat_list" :class="{active_chat: contact.id === activeChatter.id}" >
                  <div class="chat_people" >
                      <div class="chat_img"> <img :src="contact.photoURL" alt="profile image"> </div>
                      <div class="chat_ib">
                        <h5>{{contact.displayName}}</h5>
                        <p>Click to start chatting</p>
                      </div> 
                  </div>                  
                </div>                
            </div>            
            </div>

            <div class="mesgs">
            <div class="msg_history">
              <div v-for="messageObj in chatHistory" :key="messageObj.id">
                <div v-if="messageObj.author === activeChatter.displayName" class="incoming_msg">
                  <div class="incoming_msg_img"> 
                    <img :src="activeChatter.photoURL" alt="profile img"> 
                  </div>
                  <div class="received_msg">
                    <div class="received_withd_msg">
                      <p>{{messageObj.message}}</p>
                      <span class="time_date"> {{messageObj.createdAt.slice(0,22)}} by {{messageObj.author}}</span>
                      <br>
                    </div>
                  </div>
              </div>
              <div v-else-if="messageObj.author === authUser.displayName" class="outgoing_msg">
                
                  <div class="sent_msg">
                    <div class="sent_info">
                      <div class="sent_withd_msg">
                        <p>{{messageObj.message}}</p>
                        <span class="time_date"> {{messageObj.createdAt.slice(0,22)}} by {{messageObj.author}}</span>
                      </div>
                      <div class="outgoing_msg_img"> 
                        <img :src="authUser.photoURL" alt="profile img"> 
                      </div>
                    </div>
                  </div>
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
      </div>
      <page-footer />
    </div>
</template>

<script>
import firebase from 'firebase'
import SignOut from '../components/SignOut'
import DeleteContactModal from '../components/DeleteContactModal'
import AddContactModal from '../components/AddContactModal'
import Footer from '../components/Footer'

export default {
  components:{
    'sign-out':SignOut,
    'delete-contact-modal':DeleteContactModal,
    'add-contact-modal': AddContactModal,
    'page-footer':Footer
  },
    data(){
        return {
            message: "",
            searching:false,
            searchText: "",
            searchResults:[],
            showAddModal: false,
            showDeleteModal:false,
            mousedownTime:null,
            mouseupTime:null,
        }
    },
    computed:{
      authUser(){ return this.$store.state.authUser},
      allContacts(){ return this.$store.state.allContacts},
      chatHistory(){ return this.$store.state.chatHistory},
      activeChatter(){return this.$store.state.activeChatter},
      defaultPhotoURL(){ return this.$store.state.defaultPhotoURL}
    },
    methods:{
      startTiming(){
        this.mousedownTime = new Date().getTime();
      },
      endTiming(contact){
        this.mouseupTime = new Date().getTime();
        if((this.mouseupTime - this.mousedownTime) > 500){
          this.showDeleteModal = true
          this.$store.dispatch('setToDeleteContact',contact)
        }else{
          this.message = ""       
          this.$store.dispatch('displayChatHistory',contact)
          this.scrollToBottom()
        }
      },
      
      closeModal(){
        this.showAddModal = false
        this.$store.dispatch('resetFoundUsers')
        this.$store.dispatch('resetFindUserHintMsg')
      },
      closeDeleteModal(){
        this.showDeleteModal = false
        this.$store.dispatch('resetToDeleteContact')
        
      },
      searchContact(){
        this.searching = true
        this.searchResults = this.allContacts.filter((contact) =>{
          return contact.displayName.includes(this.searchText)
        })

      },
      sendMessage(){
        if(this.message){
          this.$store.dispatch('sendMessage',this.message)          
          this.message = "" 
          this.scrollToBottom()
        }else{
          return 
        }
        
      },
      //TODO: Need to fix scroll to bottom problem, now have to click  twice to scroll to bottom 
      scrollToBottom(){
        let msgHistoryBox = document.querySelector('.msg_history')
        msgHistoryBox.scrollTop = msgHistoryBox.scrollHeight
        console.log('scroll to bottom '+ msgHistoryBox.scrollHeight)
      },
        
    },
    created(){      
      firebase.auth().onAuthStateChanged((user)=>{
        if(user){
          let authUser = {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL?user.photoURL: this.$store.state.defaultPhotoURL
          }
          this.$store.dispatch('setAuthUser',authUser)
          this.$store.dispatch('fetchContacts')
      }else{
          console.log("no auth user at all")
      }
      })
        
    },    
}
</script>

<style>

.outter_container{
  margin-top: 5vh;
}
.msg_history {
  padding-top: 10px;
  height: 516px;
  overflow-y: auto;
}
.hide_page{
  opacity: 60%;
  pointer-events:none;
}
.delete_contact_container{
  background-color: #e0dddd;
  width: 30%;
  height: 15%;
  position: absolute;
  bottom: 50%;
  right: 61%;
  z-index: 101;
  padding: 10px;
}
.fade-enter-active,
.fade-leave-active{
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to{
  opacity: 0;
}
.close_add_btn{
  background:  none repeat scroll 0 0;
  border: medium none;
  border-radius: 50%;
  cursor: pointer;
  height: 33px;
  left: 100;
  width: 33px;
  margin-left: 15px;
  outline:none;
}
.close_add_btn i{
  color: rgb(243, 67, 97);
  font-size: 22px;
}
.container{max-width:1170px; margin:auto;}
img{ max-width:100%;border-radius: 50%;}
.inbox_people {
  background: none repeat scroll 0 0; /* f8f8f8*/
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
  display: flex;
  text-align: right;
  width: 60%; 
}
.heading_srch{ padding:10px 29px 10px 20px; overflow:hidden; border-bottom:1px solid #c4c4c4;}

.recent_heading h4 {
  color: #05728f;
  font-size: 21px;
  margin: auto;
}
.srch_bar input{ border:1px solid #cdcdcd; border-width:0 0 1px 0; width:100%; padding:2px 0 4px 6px; background:none; outline:none;}
.srch_bar .input-group-addon button {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  padding: 0;
  color: #707070;
  font-size: 18px;
  outline:none;
}
.srch_bar button {
  outline:none;
}
.srch_bar .input-group-addon { margin: 0 0 0 -27px;}

.chat_ib h5{ 
  font-size:15px; 
  color:#464646; 
  margin:0 0 8px 0; 
  /* background-color: pink;  */
}
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

.chat_people{ 
  overflow:hidden; 
  clear:both;
}
.chat_delete{
  float: left;
  padding: 0 0 0 15px;
  width: 88%;
}
.chat_list {
  border-bottom: 1px solid #c4c4c4;
  margin: 0;
  padding: 18px 16px 10px;
}
.inbox_chat { height: 550px; overflow-y: scroll;position: relative;}

.active_chat{ background:#F5F5F5;}

.incoming_msg{
  margin-left: -1px;
}
.incoming_msg_img {
  display: inline-block;
  width: 6%;
}
.outgoing_msg_img {
  display: inline-block;
  width: 9%;
  margin-left: 10px;
}
.received_msg {
  display: inline-block;
  padding: 0 0 0 10px;
  vertical-align: top;
  width: 92%;
 }

 .received_withd_msg p {
  background: #F5F5F5 none repeat scroll 0 0;
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
.sent_info{
  display: flex;
}
.sent_withd_msg { 
  display: inline-block;
  padding: 0 0 0 10px;
  vertical-align: top;
  width: 88%;
  /* background-color: pink; */
}
.mesgs {
  float: left;
  padding: 30px 15px 0 25px;
  width: 60%;
}

 .sent_msg p {
  background: #6595DA none repeat scroll 0 0;
  border-radius: 3px;
  font-size: 14px;
  margin: 0; color:#fff;
  padding: 5px 10px 5px 12px;
  width:100%;
}
.outgoing_msg{ overflow:hidden; margin:10px 0 10px;}
.sent_msg {
  float: right;
  width: 66%;
}
.input_msg_write input {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  color: #4c4c4c;
  font-size: 15px;
  min-height: 48px;
  width: 100%;
  outline: none;
}
.input_msg_write button {
  outline: none;
}
.type_msg {border-top: 1px solid #c4c4c4;position: relative;}

.add_contact_btn{
  background: #05728f none repeat scroll 0 0;
  border: medium none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 17px;
  height: 33px;
  left: 100;
  width: 33px;
  margin-left: 15px;
  outline: none;
}

.add_contact_btn i{
  color: #f8f8f8
}

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
.error{
    color:tomato
}

</style>