<template>
    <div class="outer-conatiner">
    <div class="container">
        <div v-if="error">{{error}}</div>
        <div class="row">
            <div class="col-md-4 col-md-offset-4">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title">Register </h3>
                    </div>
                    <div class="panel-body">
                        <form accept-charset="UTF-8" role="form" @submit.prevent="signUp">
                        <fieldset>
                            <div class="form-group">
                                <input v-model="email" class="form-control" placeholder="yourmail@example.com" name="email" type="text" required>
                                
                            </div>
                            <div class="form-group">
                                <input v-model="username" class="form-control" placeholder="username" name="username" type="text" required>
                                
                            </div>
                            <div class="form-group">
                                <input v-model="password" class="form-control" placeholder="Password" name="password" type="password" value="" required>
                            </div>
                            
                            <input class="btn btn-lg btn-success btn-block" type="submit" value="Sign Up">
                        </fieldset>
                        </form>
                        <span>Have an account, click here to <router-link to="/login">login</router-link> </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
  <!-- <div>
      Register
      <div v-if="error">{{error}}</div>
      <form @submit.prevent="signUp">
          <div class="email">
              <label >Email: </label>
              <input v-model="email" type="email" placeholder="input your email" required>
          </div>
          <div class="username">
              <label >Username: </label>
              <input v-model="username" type="text" placeholder="input your username" required>
          </div>
          <div class="password">
              <label>Password: </label>
              <input v-model="password" type="password" placeholder="At least 6 chars including number and letters" required>
          </div>
          <button type="submit">Register</button>
      </form>
      <span>Have an account, click here to <router-link to="/login">login</router-link> </span>
  </div> -->
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
.container{
    /* background-color: pink; */
    /* display: flex;
    align-items: center;
    justify-content: center; */
    margin-left: 35%;
    padding: 4px;
    /* width: 100%; */
}
.white{
    color:#000;
    background-color:#fff;
}



</style>