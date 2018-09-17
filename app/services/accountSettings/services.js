import { Apis } from 'omnibazaarjs-ws';
import { FetchChain } from 'omnibazaarjs/es';


export const getAllPublishers = async () => {
  const publishersNames = await Apis.instance().db_api().exec('get_publisher_nodes_names', []);
  return (await Promise.all(publishersNames.map(publisherName => FetchChain('getAccount', publisherName))))
    .map(publisher => publisher.toJS())
};

export const getPublisherByIp = async (publisherIp) => {
  const publishers = await getAllPublishers();
  return publishers.find(publisher => publisher.publisher_ip === publisherIp);
};

