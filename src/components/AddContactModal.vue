<template>
  <transition name="fade" appear>
    <div class="modal-overlay" >
      <div class="heading_srch">
        <div class="srch_bar">
          <div class="stylish-input-group">
            <input v-model="userToFind" type="text" class="search-bar"  placeholder="Input username" @keyup.enter="findUsers">
            <span class="input-group-addon">
            <button @click="findUsers" type="button"> <i class="fa fa-search" aria-hidden="true"></i> </button>
            </span>
          </div>
          <button @click="closeModal" class="close_add_btn" type="button"><i class="fa fa-window-close" aria-hidden="true"></i></button>          
        </div>
      </div>
      <div class="search_result_container">
        <div v-for="userToAdd in foundUsers" :key="userToAdd.id" class="chat_list" >
          <div class="chat_people">
              <div class="chat_img"> <img :src="userToAdd.photoURL? userToAdd.photoURL: defaultPhotoURL"> </div>
              <div class="chat_ib">
                <h5>{{userToAdd.displayName}} <span v-if="addable"><button class="add_contact_btn" type="button"  @click="addContact(userToAdd)"><i class="fa fa-plus" aria-hidden="true"></i></button></span></h5>
              </div>
          </div>
        </div>
        <p v-if="findUserHintMsg.length > 0">{{findUserHintMsg}}</p>
      </div>
        
    </div>
  </transition>
</template>

<script>
export default {
  
  computed:{
    foundUsers(){ return this.$store.state.foundUsers},
    findUserHintMsg(){ return this.$store.state.findUserHintMsg},
    addable(){ return this.$store.state.addable}
  },
  data(){
    return {
      userToFind:""
    }
  },
  methods:{
    findUsers(){
      this.$store.dispatch('findUsers',this.userToFind)
    },
    closeModal(){
      this.$emit('closeModal')
    },
    addContact(userToAdd){
      this.$store.dispatch('addContact', userToAdd)
      this.closeModal()
    }
  }
}
</script>

<style>

</style>