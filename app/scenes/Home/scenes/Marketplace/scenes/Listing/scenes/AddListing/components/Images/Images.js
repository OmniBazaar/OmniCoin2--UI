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
import ImageItem from './ImageItem';
import messages from '../../messages';

const imageLimit = 10;
const iconSize = 42;

const getImageId = () => {
	return shortid.generate();
}

class Images extends Component {
	onClickAddImage() {
		this.inputElement.click();
	}

	onImageChange(event) {
		let files =this.inputElement.files;
		if (files && files.length) {
			const file = files[0];
      const { uploadListingImage } = this.props.listingActions;

      if (file.type.match('image.*')) {
      	const imageId = getImageId();
      	uploadListingImage(file, imageId);
      }
    }

    this.inputElement.value = '';
	}

	renderImages() {
		return Object.keys(this.props.listingImages).map((imageId) => {
			return (
				<ImageItem key={imageId}
					imageId={imageId}
					image={this.props.listingImages[imageId]} />
			);
		});
	}

	render() {
		const { listingImages } = this.props;
		return (
			<div className='listing-image-container'>
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
	        	(Object.keys(listingImages).length < imageLimit) &&
	        	<Button className="add-img-button" onClick={this.onClickAddImage.bind(this)}>
		          <Image src={AddIcon} width={iconSize} height={iconSize} />
		        </Button>
	        }
	      </div>
      </div>
		);
	}
};

Images.propTypes = {
	listingActions: PropTypes.shape({
		uploadListingImage: PropTypes.func
	}).isRequired,
	listingImages: PropTypes.object.isRequired,
	intl: PropTypes.shape({
		formatMessage: PropTypes.func
	}).isRequired,
};

const mapState = state => {
	return {
		listingImages: state.default.listing.listingImages
	}
};

const mapDispatch = dispatch => {
	return {
		listingActions: bindActionCreators({
      uploadListingImage
    }, dispatch)
	}
};

export default connect(mapState, mapDispatch)(injectIntl(Images));