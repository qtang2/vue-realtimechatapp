<template>
  <div>
      Register page
      <div v-if="error">{{error}}</div>
      <form @submit.prevent="signUp">
          <div class="email">
              <label >Email: </label>
              <input v-model="email" type="email" placeholder="input your email">
          </div>
          <div class="username">
              <label >Username: </label>
              <input v-model="username" type="text" placeholder="input your username">
          </div>
          <div class="password">
              <label>Password: </label>
              <input v-model="password" type="password" placeholder="At least 6 chars including number and letters">
          </div>
          <button type="submit">Register</button>
      </form>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'
export default {
    data(){
        return {
            error:"",
            email:"",
            username:"",
            password:""
        }
    },
    methods:{
        signUp(){
            console.log('Sign up ' + this.password)
            firebase.auth().createUserWithEmailAndPassword(this.email,this.password)
                    .then((userCredential)=>{
                        
                        console.log('signed up successfully ')
                        // console.log(userCredential.user)
                        var user = userCredential.user
                        user.updateProfile({
                            displayName: this.username,
                            photoURL: "https://example.com/jane-q-user/profile.jpg"
                        }).then(() =>{
                    
                        //set user display name 
                        // console.log("updated display name !!!!!!!!!!")
                        // var displayName = user.displayName;
                        // var photoURL = user.photoURL;
                        // console.log(user.uid + ", display Name is " + displayName + ", and email is " + user.email + ", and photoURL is " + photoURL)

                        //add a user to users collection
                        db.collection('users').doc(user.uid).set({
                            displayName: user.displayName,
                            email: user.email,
                            photoURL: user.photoURL
                        })
                        console.log('user added to the user collection')
                        this.$router.replace('/')
                        }, function(error) {
                            // An error happened.
                            console.log(error)
                        })
                        

                        
                    })
                    .catch((error)=>{
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        console.log(error)
                    })
        }
    }


}
</script>

<style>

</style>