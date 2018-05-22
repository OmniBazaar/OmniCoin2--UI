import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Image, Button } from 'semantic-ui-react';
import AddIcon from '../../../../../../../../images/btn-add-image.svg';
import { getFileExtension } from '../../../../../../../../../../utils/file';
import {
  addImage,
  removeImage
} from '../../../../../../../../../../services/listing/listingActions';
import ImageItem from './image';

const imageLimit = 10;
const iconSize = 42;

class Images extends Component {
	onClickAddImage() {
		this.inputElement.click();
	}

	onImageChange(event) {
		let files =this.inputElement.files;
		if (files && files.length) {
			const file = files[0];
      const { addImage } = this.props.listingActions;

      if (file.type.match('image.*')) {
      	addImage(file);
      }
    }
	}

	renderImages() {
		return this.props.listingImages.map((image, index) => {
			return (
				<ImageItem key={index} image={image} index={index} />
			);
		});
	}

	render() {
		return (
			<div>
				<input
	        ref={(ref) => this.inputElement = ref}
	        type="file"
	        onChange={this.onImageChange.bind(this)}
	        className="filetype"
	        accept="image/*"
	      />
	      <div className="images-wrapper">
	        {this.renderImages()}
	        <Button className="add-img-button" onClick={this.onClickAddImage.bind(this)}>
	          <Image src={AddIcon} width={iconSize} height={iconSize} />
	        </Button>
	      </div>
      </div>
		);
	}
};

Images.propTypes = {
	listingActions: PropTypes.shape({
		addImage: PropTypes.func,
		removeImage: PropTypes.func
	}).isRequired,
	listingImages: PropTypes.array.isRequired
};

const mapState = state => {
	return {
		listingImages: state.default.listing.listingImages
	}
};

const mapDispatch = dispatch => {
	return {
		listingActions: bindActionCreators({
      addImage,
      removeImage
    }, dispatch)
	}
};

export default connect(mapState, mapDispatch)(Images);