<template>
<div>
  <button @click='hashit'>hash</button>
</div>
</template>

<script>
import {
  defineComponent
} from 'vue';

import loader from 'blake3/browser-async';

let blake3;

loader().then(loaded => {
  blake3 = loaded;
});

export default defineComponent({
  name: 'FirstTest',
  data() {
    return {
    };
  },
  methods: {
    // https://peer100.jengas.io/api.php?q=getMiningInfo
    hashit() {
      console.time('foo');
      for(let i = 0; i < 1000000; i++) {
        blake3.hash('5pGDSjhWF81if1GXsh7prJKa8g8zjnmNEmbKeWfFKxxSRgMJVTchej8JGc2XK4Niuhc6EHzrakRG7JG447UQHUkX');
      }
      console.timeEnd('foo');
    }
  },
});
</script>
