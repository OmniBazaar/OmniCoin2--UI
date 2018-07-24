import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Image, Button } from 'semantic-ui-react';
import { injectIntl } from 'react-intl';
import shortid from 'shortid';

import AddIcon from '../../../../../../../../images/btn-add-image.svg';
import {
  addListingImage,
  deleteListingImage
} from '../../../../../../../../../../services/listing/listingActions';
import {
  deleteListingDefaultImage,
  uploadListingDefaultImage
} from '../../../../../../../../../../services/listing/listingDefaultsActions';
import ImageItem from './ImageItem';

const imageLimit = 10;
const iconSize = 42;

export const getImageId = () => shortid.generate();

class Images extends Component {
  componentWillReceiveProps(nextProps) {
    /*
    const { publisher } = this.props;

    if (publisher && nextProps.publisher && nextProps.publisher.id !== this.props.publisher.id) {
      const { isListingDefaults, listingDefaultsImages, listingImages } = this.props;
      const images = { ...(isListingDefaults ? listingDefaultsImages : listingImages) };
      const deleteImage = isListingDefaults ? deleteListingDefaultImage : deleteListingImage;
      const uploadImage = isListingDefaults ? uploadListingDefaultImage : uploadListingImage;


      Object.keys(images)
        .forEach((imageId) => {
          const image = images[imageId];
          const { id, file } = image;
          const deleteParams = isListingDefaults ? [image] : [publisher, image];
          const uploadParams = isListingDefaults ? [file, id] : [nextProps.publisher, file, id];

          deleteImage(...deleteParams);
          uploadImage(...uploadParams);
        });
    }*/
  }

  onClickAddImage() {
    this.inputElement.click();
  }

  onImageChange() {
    const { files } = this.inputElement;

    if (files && files.length) {
      const file = files[0];

      if (file.type.match('image.*')) {
        this.uploadImage(file);
      }
    }

    this.inputElement.value = '';
  }

  uploadImage(file) {
    const imageId = getImageId();
    const { isListingDefaults, publisher } = this.props;

    if (isListingDefaults) {
      const { uploadListingDefaultImage } = this.props.listingDefaultsActions;
      uploadListingDefaultImage(file, imageId);
    } else {
      const { addListingImage } = this.props.listingActions;
      addListingImage(file, imageId);
    }
  }

  getImages() {
    const { isListingDefaults } = this.props;

    if (isListingDefaults) {
      return this.props.listingDefaultsImages;
    }

    return this.props.listingImages;
  }

  renderImages() {
    const { isListingDefaults, publisher } = this.props;
    const images = this.getImages();

    return Object
      .keys(images)
      .map((imageId) => (
        <ImageItem
          key={imageId}
          imageId={imageId}
          image={images[imageId]}
          isListingDefaults={isListingDefaults}
          publisher={publisher}
        />
      ));
  }

  render() {
    const { disabled } = this.props;
    const images = this.getImages();

    return (
      <div className="listing-image-container">
        <input
          ref={(ref) => { this.inputElement = ref; }}
          type="file"
          onChange={() => this.onImageChange()}
          className="filetype"
          accept="image/*"
        />
        <div className="images-wrapper">
          {this.renderImages()}
          {(Object.keys(images).length < imageLimit) &&
          <Button
            className="add-img-button"
            onClick={this
            .onClickAddImage
            .bind(this)}
            type="button"
          >
            <Image src={AddIcon} width={iconSize} height={iconSize} />
          </Button>}
        </div>
      </div>
    );
  }
}

Images.propTypes = {
  listingActions: PropTypes.shape({
    deleteListingImage: PropTypes.func,
    addListingImage: PropTypes.func,
  }).isRequired,
  listingDefaultsActions: PropTypes.shape({
    deleteListingDefaultImage: PropTypes.func,
    uploadListingDefaultImage: PropTypes.func,
  }).isRequired,
  listingImages: PropTypes.shape({}).isRequired,
  listingDefaultsImages: PropTypes.shape({}).isRequired,
  isListingDefaults: PropTypes.bool,
  publisher: PropTypes.shape({
    id: PropTypes.string,
  })
};

Images.defaultProps = {
  isListingDefaults: false,
  publisher: null
};

const mapState = state => ({
  listingImages: state.default.listing.listingImages,
  listingDefaultsImages: state.default.listingDefaults.images,
});

const mapDispatch = dispatch => ({
  listingActions: bindActionCreators({
    deleteListingImage,
    addListingImage
  }, dispatch),
  listingDefaultsActions: bindActionCreators({
    deleteListingDefaultImage,
    uploadListingDefaultImage
  }, dispatch)
});

export default connect(mapState, mapDispatch)(injectIntl(Images));
