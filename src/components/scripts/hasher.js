import load from '../../../node_modules/blake3/browser-async';

let blake3;

load().then(async loaded => {
  console.log('loaded', loaded);
  blake3 = loaded;
});

self.onmessage = function(msg) {
  if(msg.data[0] === 'hash') {
    hash(msg.data[1], msg.data[2]);
  }
}

function hash(id, data) {
  let hashes = 0;
  let tstart = Date.now();

  while(1) {
    let duration = Math.floor((Date.now() - tstart) / 1000);


    if(duration >= 1) {
      postMessage({
        id,
        hashes
      });
      tstart = Date.now();
      hashes = 0;
    }
    blake3.hash(data);
    hashes++;
  }
}
