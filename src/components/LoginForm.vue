<template>
<fragment>
   <!-- Login Form -->
       <div class="txt-white text-center font-blod p-5 rounded mb-4"
    v-if="login_show_alert" :class="login_alert_variant">
        {{login_alert_msg}}
    </div>
          <vee-form 
          @submit="login" :validation-schema="loginSchema">
            <!-- Email -->
            <div class="mb-3">
              <label class="inline-block mb-2">Email</label>
              <vee-field name="email" type="email"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Email" 
                   ref="email"/>
              <ErrorMessage class="text-red-600" name="email"/>
            </div>
            <!-- Password -->
            <div class="mb-3">
              <label class="inline-block mb-2">Password</label>
              <vee-field name="password" type="password"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Password" />
              <ErrorMessage class="text-red-600" name="password"/>
            </div>
            <button type="submit" :disabled="login_in_submission"
              class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
                hover:bg-purple-700">
              Submit
            </button>
          </vee-form>
          </fragment>
</template>

<script>
export default {
  name: 'loginForm',
  props: ['tab'],
  data() {
    return {
      loginSchema: {
        email: 'required|email',
        password: 'required|min:3|max:32',
      },
      login_in_submission: false,
      login_show_alert: false,
      login_alert_variant: 'bg-blue-500',
      login_alert_msg: 'Logging in...',
    };
  },
  // watch: {
  //   tab: {
  //     handler(val, oldVal) {
  //       console.log(`new value ${val.tab} - ${oldVal.tab}`);
  //       this.$nextTick(function () {
  //         this.$refs.email.$el.focus();
  //       });
  //     },
  //   },
  // },
  methods: {
    focus() {
          this.$refs.email.$el.focus();
    },
    async login(values) {
      this.login_show_alert = true;
      this.login_in_submission = true;
      this.login_alert_variant = 'bg-blue-500';
      this.login_alert_msg = 'Logging in...';
      console.log(values);

      // request
      try {
        await this.$store.dispatch('login', values);
      } catch (error) {
        this.login_in_submission = false;
        this.login_alert_variant = 'bg-red-500';
        this.login_alert_msg = 'invalid login details.';
        return;
      }

      // after finishing the request
      this.login_alert_variant = 'bg-green-500';
      this.login_alert_msg = 'Logged in succefully.';
    },
  },
  // mounted() {
  //   // auto focus
  //   this.$nextTick(function () {
  //     console.log(this.$refs.email.$el);
  //     this.$refs.email.$el.focus();
  //   });
  // },
  umounted() {
    this.login_in_submission = false;
    this.login_show_alert = false;
  },
};
</script>

<style>

</style>
