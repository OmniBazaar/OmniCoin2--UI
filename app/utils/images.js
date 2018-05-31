import { getSignedUrl } from './signed-requester';
import { AWS_ACCESS_KEY, AWS_ASSOC_TAG } from './constants';

export default {
  /**
   * @param {string} productId
   *
   * @returns {Promise<Blob>}
   */
  async getImageFromAmazon(productId) {
    const params = {
      Service: 'AWSECommerceService',
      Operation: 'ItemLookup',
      AWSAccessKeyId: AWS_ACCESS_KEY,
      AssociateTag: AWS_ASSOC_TAG,
      ItemId: productId,
      IdType: 'ASIN',
      ResponseGroup: 'Images',
    };

    const url = getSignedUrl(params);
    const amazonResponse = await fetch(url);
    const doc = (new DOMParser()).parseFromString(await amazonResponse.text(), 'application/xml');
    const imageURL = doc.querySelector('LargeImage URL').innerHTML;

    return (await fetch(imageURL)).blob();
  },
};
