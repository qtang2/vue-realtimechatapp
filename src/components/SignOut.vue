<template>
  <div class="signout-head"> 
      <span class="welcome" v-if="loggedIn">Welcome, {{authUserName}} </span>
      <span v-else class="welcome">Please Log in </span>
      <button type="button" class="btn btn-link" @click="signOut">Sign Out</button>
    
      
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
    data(){
        return{
            loggedIn:false,
            authUserName: ""
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
                // console.log('Sign out MMMMMMMMM set to trueeeeeeee')
                this.loggedIn = true
                this.authUserName = user.displayName
            }else{
                this.loggedIn = false
            }
        })
    }

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