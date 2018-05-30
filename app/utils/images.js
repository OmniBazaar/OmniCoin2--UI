import { getSignedUrl } from './signed-requester';
import { AWS_ACCESS_KEY, AWS_ASSOC_TAG } from './constants';

export default {
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

    const response = await fetch({ method: 'GET', url });

    console.log(response);

    return response;
  },
};
