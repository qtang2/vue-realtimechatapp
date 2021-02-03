<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  beforeMount(){
    firebase.auth().onAuthStateChanged((user)=>{
      if(!user){
        console.log("No user at all, then go to login page")
        if(this.$route.path === '/login'){
          return 
        }else{
          this.$router.replace('/login')
        }
      }else if(this.$route.path == '/login' || this.$route.path == '/register'){
        console.log("already logged in then go to home page", user)
        this.$router.replace('/')
      }
    })
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
