import { createStore } from 'vuex';
import { Howl } from 'howler';
import helper from '@/includes/helper';

import {
   auth, db, 
  //  usersCollection,
    database 
  } from '@/includes/firebase';

export default createStore({
  state: {
    authModalShow: false,
    userLoggedIn: false,
    currentAudio: {},
    sound: {
      playing: () => {
        return false;
      },
      play: () => {
        return false;
      }
    },
    seek: '00:00',
    duration: '00:00',
    playerProgress: '0%'
  },
  mutations: {
    toggleAuthModal: (state) => {
      state.authModalShow = !state.authModalShow;
      console.log(state.authModalShow);
    },
    toggleAuth: (state) => {
      state.userLoggedIn = !state.userLoggedIn;
    },
    newAudio(state, payload) {
      state.currentAudio = payload;
      state.sound = new Howl({
        src: [payload.url],
        html5: true,
      });
    },
    updatePosition(state) {
      const seek = state.sound.seek();
      const duration = state.sound.duration();
      state.seek = helper.formatTime(seek);
      state.duration = helper.formatTime(duration);
      state.playerProgress = `${(seek / duration) * 100}%`;
    }
  },
  getters: {
    authModalShow: (state) => {
      return state.authModalShow;
    },
    playing: (state) => {
      // if (state.sound.plying) {
        return state.sound.playing();
      // }
      // console.log("hey");
      // return false;
    },
  },
  actions: {
    async register({ commit }, payload) {
      const values = payload;
      const userCred = await auth.createUserWithEmailAndPassword(
        auth.getAuth(), values.email, values.password,
        );
      // const docRef = await db.addDoc(usersCollection, {
      //   name: values.name,
      //   email: values.email,
      //   age: values.age,
      //   country: values.country,
      //   });
        const docRef2 = await db.setDoc(db.doc(database, 'users', `${userCred.user.uid}`), {
          name: values.name,
          email: values.email,
          age: values.age,
          country: values.country,
          });
      // await userCred.user.updateProfile({
      //   displayName: values.name
      // });
      await auth.updateProfile(userCred.user, {
        displayName: values.name
      });

      console.log("Document written with ID: ", docRef2);
      console.log("----");
      console.log(userCred);
      commit('toggleAuth');
    },
    async login({ commit }, values) {
      await auth.signInWithEmailAndPassword(auth.getAuth(), values.email, values.password);
      commit('toggleAuth');
    },
    init_login({ commit },) {
      const Auth = auth.getAuth();
      const user = Auth.currentUser;
      if (user) {
        commit('toggleAuth');
      }
    },
    async logout({ commit }) {
      await auth.signOut(auth.getAuth());
      commit('toggleAuth');
    },
    async newAudio({ commit, state, dispatch }, payload) {
      if (state.sound instanceof Howl) {
        state.sound.unload();
      }
      commit('newAudio', payload);
      state.sound.play();

      state.sound.on('play', () => {
        requestAnimationFrame(() => {
          dispatch('progress');
        });
      });
    },
    async toggleAudio({ state }) {
      if (!state.sound.playing) {
        return;
      }
      if (state.sound.playing()) {
        state.sound.pause();
      } else {
        state.sound.play();
      }
    },
    progress({ commit, dispatch }) {
      commit('updatePosition');
      
      // state.sound.playing()
      if (true) {
        requestAnimationFrame(() => {
          dispatch('progress');
        });
      }
    },
    // payload is $event in this case 
    updateSeek({ state, dispatch }, payload) {
      if (!state.sound.playing) {
        return;  
      }
      const { x, width } = payload.currentTarget.getBoundingClientRect();
      // distance between document and our element ( x ) 
      const clickX = payload.clientX - x;
      // width of our element
      const percentage = clickX / width;
      const seconds = state.sound.duration() * percentage;
      state.sound.seek(seconds);

      state.sound.once('seek', () => {
        dispatch('progress');
      });
    }
  },
  
  modules: {
  },
});
