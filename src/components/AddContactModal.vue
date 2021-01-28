<template>
  <transition name="fade" appear>
    <div class="modal-overlay" >
      <div class="heading_srch">
        <div class="srch_bar">
          <div class="stylish-input-group">
            <input v-model="userToFind" type="text" class="search-bar"  placeholder="Find a user by name" @keyup.enter="findUser">
            <span class="input-group-addon">
            <button @click="findUser" type="button"> <i class="fa fa-search" aria-hidden="true"></i> </button>
            </span>
          </div>
          <button @click="closeModal" class="close_add_btn" type="button"><i class="fa fa-window-close" aria-hidden="true"></i></button>
          
        </div>
      </div>
      <div class="search_result_container">
        <div v-for="userToAdd in foundUsers" :key="userToAdd.displayName" class="chat_list" >
          <div class="chat_people">
              <div class="chat_img"> <img :src="userToAdd.photoURL? userToAdd.photoURL: defaultPhotoURL"> </div>
              <div class="chat_ib">
                <h5>{{userToAdd.displayName}} <span><button class="add_contact_btn" type="button" @click="addContact(userToAdd)"><i class="fa fa-plus" aria-hidden="true"></i></button></span></h5>
              </div>
          </div>
        </div>
        <p v-if="hintMsg.length > 0">{{hintMsg}}</p>
      </div>
        
    </div>
  </transition>
</template>

<script>
export default {
  props:['foundUsers','hintMsg'],
  data(){
    return {
      userToFind:""
    }
  },
  methods:{
    findUser(){
      this.$emit('findUser',this.userToFind)
    },
    closeModal(){
      this.$emit('closeModal')
    },
    addContact(userToAdd){
      this.$emit('addContact',userToAdd)
    }
  }
}
</script>

<style>

</style>