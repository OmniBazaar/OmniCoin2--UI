import { getSignedUrl } from './signed-requester';

export default {
  /**
   * @param {string} productId
   *
   * @returns {Promise<Blob>}
   */
  async getImageFromAmazon(productId, { accessKey, secret, assocTag }) {
    const params = {
      AssociateTag: assocTag,
      AWSAccessKeyId: accessKey,
      Service: 'AWSECommerceService',
      Operation: 'ItemLookup',
      ItemId: productId,
      IdType: 'ASIN',
      ResponseGroup: 'Images',
    };

    const url = getSignedUrl(params, { accessKey, secret });
    const amazonResponse = await fetch(url);
    const doc = (new DOMParser()).parseFromString(await amazonResponse.text(), 'application/xml');
    const imageURL = doc.querySelector('LargeImage URL').innerHTML;

    return (await fetch(imageURL)).blob();
  },
};
