import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Image, Button } from 'semantic-ui-react';
import { injectIntl } from 'react-intl';
import shortid from 'shortid';
import AddIcon from '../../../../../../../../images/btn-add-image.svg';
import { getFileExtension } from '../../../../../../../../../../utils/file';
import {
	uploadListingImage
} from '../../../../../../../../../../services/listing/listingActions';
import {
	uploadListingDefaultImage
} from '../../../../../../../../../../services/listing/listingDefaultsActions';
import ImageItem from './ImageItem';
import messages from '../../messages';

const imageLimit = 10;
const iconSize = 42;

export const getImageId = () => shortid.generate();

class Images extends Component {
  onClickAddImage() {
    this.inputElement.click();
  }

  onImageChange(event) {
    const files = this.inputElement.files;
    if (files && files.length) {
      const file = files[0];
      console.log(file);

      if (file.type.match('image.*')) {
      	this.uploadImage(file);
      }
    }

    this.inputElement.value = '';
  }

  uploadImage(file) {
  	const imageId = getImageId();
  	const { isListingDefaults } = this.props;
  	if (isListingDefaults) {
  		const { uploadListingDefaultImage } = this.props.listingDefaultsActions;
  		uploadListingDefaultImage(file, imageId);
  	} else {
			const { uploadListingImage } = this.props.listingActions;
  		uploadListingImage(file, imageId);
  	}
  }

  getImages() {
  	const { isListingDefaults } = this.props;
  	if (isListingDefaults) {
  		return this.props.listingDefaultsImages;
  	} else {
  		return this.props.listingImages;
  	}
  }

  renderImages() {
  	const { isListingDefaults } = this.props;
  	const images = this.getImages();
    return Object.keys(images).map((imageId) => (
      <ImageItem
        key={imageId}
        imageId={imageId}
        image={images[imageId]}
        isListingDefaults={isListingDefaults}
      />
    ));
  }

  render() {
  	const images = this.getImages();
    return (
      <div className="listing-image-container">
        <input
          ref={(ref) => this.inputElement = ref}
          type="file"
          onChange={this.onImageChange.bind(this)}
          className="filetype"
          accept="image/*"
        />
        <div className="images-wrapper">
          {this.renderImages()}
          {
	        	(Object.keys(images).length < imageLimit) &&
	        	<Button className="add-img-button"
	        		onClick={this.onClickAddImage.bind(this)}
	        		type='button'>
  						<Image src={AddIcon} width={iconSize} height={iconSize} />
		        </Button>
	        }
        </div>
      </div>
    );
  }
}

Images.propTypes = {
  listingActions: PropTypes.shape({
    uploadListingImage: PropTypes.func
  }).isRequired,
  listingImages: PropTypes.object.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func
  }).isRequired,
  isListingDefaults: PropTypes.bool
};


Images.defaultProps = {
	isListingDefaults: false
};

const mapState = state => ({
  listingImages: state.default.listing.listingImages,
  listingDefaultsImages: state.default.listingDefaults.images
});

const mapDispatch = dispatch => ({
  listingActions: bindActionCreators({
    uploadListingImage
  }, dispatch),
  listingDefaultsActions: bindActionCreators({
  	uploadListingDefaultImage
  }, dispatch)
});

export default connect(mapState, mapDispatch)(injectIntl(Images));
