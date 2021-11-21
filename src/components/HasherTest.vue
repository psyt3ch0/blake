<template>
  <div id='wrapper'>
    <DataTable id='workers-list' :value="workers" responsiveLayout="scroll" columnResizeMode="fit" >
        <Column field="id" header="id"></Column>
        <Column field="rate" header="hashes/sec"></Column>
    </DataTable>
    <div>
      <Button class="p-button-outlined p-button-sm" @click='add'>+</Button>
      <Button class="p-button-outlined p-button-sm" @click='del'>-</Button>
    </div>
  </div>
</template>

<script>
import {
  defineComponent
} from 'vue';

import Hasher from './scripts/hasher.js?worker'

import load from '../../node_modules/blake3/browser-async';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';

let blake3;

load().then(loaded => {
  blake3 = loaded;
});


export default defineComponent({
  name: 'FirstTest',
  data() {
    return {
      workers: [{
        hasher: null,
        id: 'total',
        rate: 0
      }],
      hinterval: null
    };
  },
  components: {
    Button,
    DataTable,
    Column
  },
  methods: {
    add() {
      const item = {
        hasher: new Hasher(),
        id: `hasher ${this.workers.length}`,
        rate: 0
      }
      this.workers.splice(this.workers.length - 1, 0, item);
      // this.workers.unshift(item);
      item.hasher.onmessage = this.hasherMessage;

      if(this.hinterval === null) {
        this.hinterval = setInterval(this.update, 1000);
      }
      setTimeout(() => {
        item.hasher.postMessage(['hash', item.id, '5pGDSjhWF81if1GXsh7prJKa8g8zjnmNEmbKeWfFKxxSRgMJVTchej8JGc2XK4Niuhc6EHzrakRG7JG447UQHUkX']);
      }, 1000);
    },
    del() {
      if(this.workers.length === 1) {
        return;
      }
      this.workers.shift().hasher.terminate();
      if(this.workers.length === 1) {
        clearInterval(this.hinterval);
      }
    },
    hasherMessage(msg) {
      let worker = this.workers.find(w => w.id === msg.data.id);

      if(worker) {
        worker.rate = msg.data.hashes;
      }
    },
    update() {
      let total = this.workers.reduce((a, w) => {
        if(w.id !== 'total') {
          return a + w.rate;
        } else {
          return a;
        }
      }, 0);
      let last = this.workers[this.workers.length - 1];

      last.rate = total;
    }
  },
});
</script>

<style scoped>
#wrapper {
  text-align: left;
  width:560px;
  margin:auto;
}
#workers-list {
  /* width: 480px; */
  margin:auto;
}
</style>
