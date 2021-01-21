<template>
  <div>
      Logged In 
      <span v-if="loggedIn"> Yes </span>
      <span v-else> No </span>
      <button @click="signOut">Sign Out</button>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
    data(){
        return{
            loggedIn:false
        }
        
    },
    methods:{
        signOut(){
            firebase.auth().signOut()
                    .then(()=>{
                        console.log('sign out successfully')
                        this.$router.replace({name:'Login'})
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
        }
    },
    created(){
        firebase.auth().onAuthStateChanged((user)=>{
            // this.loggedIn = !!user
            if(user){
                this.loggedIn = true
            }else{
                this.loggedIn = false
            }
        })
    }

}
</script>

<style>

</style>