import { Apis } from 'omnibazaarjs-ws';
import { FetchChain } from 'omnibazaarjs/es';
import dns from 'dns';
import net from 'net';

export const getAllPublishers = async () => {
  const publishersNames = await Apis.instance().db_api().exec('get_publisher_nodes_names', []);
  const publishers = (
	  (await Promise.all(publishersNames.map(publisherName => FetchChain('getAccount', publisherName)))
    ).map(publisher => publisher.toJS())
  );
  const promises = [];
  publishers.forEach(publisher => {
    if (!net.isIP(publisher.publisher_ip)) {
      promises.push(new Promise(function(resolve, reject) {
        dns.lookup(publisher.publisher_ip, (err, address) => {
          if (!err) {
            publisher.publisher_ip = address;
            resolve();
          }  else {
            reject(err);
          }
        });
      }));
    }
  });
  await Promise.all(promises);
  return publishers;
};

export const getPublisherByIp = async (publisherIp) => {
  const publishers = await getAllPublishers();
  return publishers.find(publisher => publisher.publisher_ip === publisherIp);
};

