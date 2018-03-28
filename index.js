import IPFS from "ipfs";
import Room from "ipfs-pubsub-room";

const ipfs = new IPFS({
  EXPERIMENTAL: {
    pubsub: true
  },
  config: {
    Addresses: {
      Swarm: [
        "/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star"
      ]
    }
  }
});

ipfs.once("ready", () =>
  ipfs.id((err, info) => {
    if (err) {
      throw err;
    }

    console.log(`IPFS node ready with address ${info.id}`);
  })
);

const room = Room(ipfs, "ipfs-pubsub-demo");

room.on("peer joined", peer => console.log(`Peer ${peer} joined!`));
room.on("peer left", peer => console.log(`Peer ${peer} left!`));

room.on("peer joined", peer => room.sendTo(peer, `Hello ${peer}!`));
room.on("message", message =>
  console.log(`Got a message from ${message.from}: ${message.data.toString()}`)
);
