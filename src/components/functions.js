export function shortenString(str) {
  if (!str) return;
  if (str.length <= 11) {
    return str;
  } else {
    let firstPart = str.substring(0, 10);
    let lastPart = str.substring(str.length - 4);
    return `${firstPart}...${lastPart}`;
  }
}


export const fundraiseData=[
  {
       owner:"0x131d047D271444ccE9FC6a9167DEA91963c3a402",
         title:"School campaign",
         image:"https://bafkreialgx55n7zxy2gkpg3thmych4x64ltdvqv6jpbupxvwb653442xmq.ipfs.w3s.link",
         description:"we need your support",
         goal:100000000000000000000,
         funded:20000000000000000000,
         Ended:false
  },
   {
       owner:"0x131d047D271444ccE9FC6a9167DEA91963c3a402",
         title:"School campaign",
         image:"https://bafkreialgx55n7zxy2gkpg3thmych4x64ltdvqv6jpbupxvwb653442xmq.ipfs.w3s.link",
         description:"we need your support",
         goal:100000000000000000000,
         funded:20000000000000000000,
         Ended:false
  },
   {
       owner:"0x131d047D271444ccE9FC6a9167DEA91963c3a402",
         title:"School campaign",
         image:"https://bafkreialgx55n7zxy2gkpg3thmych4x64ltdvqv6jpbupxvwb653442xmq.ipfs.w3s.link",
         description:"we need your support",
         goal:100000000000000000000,
         funded:20000000000000000000,
         Ended:false
  },
   {
       owner:"0x131d047D271444ccE9FC6a9167DEA91963c3a402",
         title:"School campaign",
         image:"https://bafkreialgx55n7zxy2gkpg3thmych4x64ltdvqv6jpbupxvwb653442xmq.ipfs.w3s.link",
         description:"we need your support",
         goal:100000000000000000000,
         funded:20000000000000000000,
         Ended:false
  }
]