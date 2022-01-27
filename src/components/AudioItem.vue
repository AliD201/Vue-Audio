!<template>
  <li class="flex justify-between items-center p-3 pl-6 cursor-pointer transition 
          duration-300 hover:bg-gray-50">
          <div>
            <router-link
             :to="{ name: 'audio', params: {id: audio.docID}  }"
              class="font-bold block text-gray-600">{{ audio.modified_name }}</router-link>
            <span class="text-gray-500 text-sm">{{ audio.display_name }} </span>
          </div>

          <div class="text-gray-600 text-lg">
            <router-link custom
              :to="{ name: 'audio', params: {id: audio.docID}, hash: '#comments' }"
               v-slot="{ navigate }"
               >
            <span class="comments" @click="navigate">
              <i class="fa fa-comments text-gray-600"></i>
              {{ audio.comment_count }}
            </span>
            </router-link>  
          </div>
        </li>
</template>

<script>
export default {
name: 'AudioItem',
props: ['audio'],

};
</script>

<style>

</style>
