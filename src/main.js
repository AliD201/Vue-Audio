import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/tailwind.css';
import './assets/main.css';
import veeValidatePlugin from './includes/validation';
// import { getAuth } from 'firebase/auth';
import { auth } from './includes/firebase';

let app;

auth.onAuthStateChanged(auth.getAuth(), () => {
    if (!app) {
        app = createApp(App);
        app.use(store);
        app.use(router);
    
        // validator 
        app.use(veeValidatePlugin);
    
        app.mount('#app');
    }
});
