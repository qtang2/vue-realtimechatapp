<template>
  <div class="signout-head"> 
      <span class="welcome" v-if="authUser.displayName !==''">Welcome, {{authUser.displayName}} </span>
      <span v-else class="welcome">Please Log in </span>
      <button type="button" class="btn btn-link" @click="signOut">Sign Out</button>      
  </div>
</template>

<script>
export default {
    computed:{
        authUser(){ return this.$store.state.authUser}
    },
    methods:{
        signOut(){
            this.$store.dispatch('signOut')
        }
    },

}
</script>

<style>
.signout-head{
    display: flex;
    margin-left: 75%;
    /* background-color: pink; */

}
.signout-head span{
    align-self: center;
    /* background-color: green; */
}


</style>