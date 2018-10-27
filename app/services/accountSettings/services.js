import { Apis } from 'omnibazaarjs-ws';
import { FetchChain } from 'omnibazaarjs/es';
import dns from 'dns';
import net from 'net';

export const lookupIp = async (address) => {
  return new Promise(function(resolve, reject) {
    dns.lookup(address, (err, address) => {
      if (!err) {
        resolve(address);
      }  else {
        reject(err);
      }
    });
  })
};


export const getAllPublishers = async () => {
  const publishersNames = await Apis.instance().db_api().exec('get_publisher_nodes_names', []);
  const publishers = await Promise.all(
    publishersNames.map(async publisherName => await getAccountByName(publisherName))
  );
  const promises = [];
  publishers.forEach(publisher => {
    if (!net.isIP(publisher.publisher_ip)) {
      promises.push(lookupIp(publisher.publisher_ip).then(ip => publisher.publisher_ip = ip));
    }
  });
  await Promise.all(promises);

  return publishers;
};

export const getPublisherByIp = async (publisherIp) => {
  const publishers = await getAllPublishers();
  let ip = publisherIp;
  if (!net.isIP(publisherIp)) {
    ip = await lookupIp(publisherIp);
    console.log('IP ', ip, publishers);
  }
  return publishers.find(publisher => publisher.publisher_ip === ip);
};

export const getAccountByName = async (username) => {
  return await Apis.instance().db_api().exec('get_account_by_name', [username])
}