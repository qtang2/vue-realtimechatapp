<template>

    <div>
        Login page
        <div class="login">
            <form @submit.prevent="loginWithEmail">
                <div class="email">
                    <label >Email: </label>
                    <input v-model="email" type="email" placeholder="email">
                </div>
                <div class="password">
                    <label >Password: </label>
                    <input v-model="password" type="password" placeholder="password">
                </div>
                <button type="submit">Log In</button>
            </form>
            <hr/>
            <center><h4>OR</h4></center>
            <input @click="loginWithGoogle" class="btn btn-lg btn-google btn-block" type="submit" value="Login with Google">
        </div>
        <div v-if="error">{{error}}</div>
        <span>Need an account, click here to <router-link to="/register">register </router-link> </span>

    </div>
</template>

<script>
import firebase from 'firebase/app'
import "firebase/auth";

export default {
    data(){
        return{
            email:"",
            password: "",
            error:""
        }
    },
    methods:{
        loginWithGoogle(){
            var provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
            firebase.auth()
                    .signInWithPopup(provider)
                    .then((result) => {
                        /** @type {firebase.auth.OAuthCredential} */
                        var credential = result.credential;

                        // This gives you a Google Access Token. You can use it to access the Google API.
                        var token = credential.accessToken;
                        // The signed-in user info.
                        var user = result.user;
                        //add a user to users collection, Need to check if user already exist in users collection(no need, firebase wont add repeatly)
                        db.collection('users').doc(user.uid).set({
                            displayName: user.displayName,
                            email: user.email,
                            photoURL: user.photoURL
                        })
                        console.log('googllllllleeee user added to the user collection')

                        this.$router.push('/')
                        // ...
                    }).catch((error) => {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        // The email of the user's account used.
                        var email = error.email;
                        // The firebase.auth.AuthCredential type that was used.
                        var credential = error.credential;
                        // ...
                    });
        },
        //TODO: Need to fix this function, it is not working now 
        loginWithEmail(){
            console.log('login with email' + this.email + ", " + this.password )
            console.log("&&&&&&&&&&&&&&&&&&&")
            firebase.auth().signInWithEmailAndPassword(this.email, this.password)
                    .then((user) => {
                        console.log(this.email + ", " + this.password)
                        this.$router.replace('/')
                    })
                    .catch((error) => {
                        console.log(error.message)
                        this.error = error.message
                        var errorCode = error.code;
                        var errorMessage = error.message;
                    });
        }
    }
}
</script>

<style scoped>
.white{
    color:#000;
    background-color:#fff;
}

.btn-facebook {
    color: #ffffff;
    -webkit-text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);
    text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);
    background-color: #2b4b90;
    *background-color: #133783;
    background-image: -moz-linear-gradient(top, #3b5998, #133783);
    background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#3b5998), to(#133783));
    background-image: -webkit-linear-gradient(top, #3b5998, #133783);
    background-image: -o-linear-gradient(top, #3b5998, #133783);
    background-image: linear-gradient(to bottom, #3b5998, #133783);
    background-repeat: repeat-x;
    border-color: #133783 #133783 #091b40;
    border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ff3b5998', endColorstr='#ff133783', GradientType=0);
    filter: progid:DXImageTransform.Microsoft.gradient(enabled=false);
}

    .btn-facebook:hover,
    .btn-facebook:focus,
    .btn-facebook:active,
    .btn-facebook.active,
    .btn-facebook.disabled,
    .btn-facebook[disabled] {
        color: #ffffff;
        background-color: #133783 !important;
        *background-color: #102e6d !important;
    }

    .btn-facebook:active,
    .btn-facebook.active {
        background-color: #0d2456 \9 !important;
    }

</style>