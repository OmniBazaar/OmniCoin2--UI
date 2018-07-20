import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Image, Button, Loader, Dimmer } from 'semantic-ui-react';
import { injectIntl } from 'react-intl';
import fileUrl from 'file-url';
import RemoveIcon from '../../../../../../../../images/btn-remove-image-norm+press.svg';
import LoadingIcon from '../../../../../../../../images/loading.gif';
import {
  deleteListingImage,
  clearListingImageError
} from '../../../../../../../../../../services/listing/listingActions';
import {
  deleteListingDefaultImage,
  clearListingDefaultImageError
} from '../../../../../../../../../../services/listing/listingDefaultsActions';
import messages from '../../messages';

const imageSize = 42;
const iconSize = 23;
const loadingIconSize = 24;

class ImageItem extends Component {
	state = {
	  ready: false,
	  url: null
	}

	componentWillMount() {
	  const { localFilePath, file, thumb } = this.props.image;
	  if (localFilePath) {
	  	this.setState({
	  		ready: true,
	  		url: fileUrl(localFilePath)
	  	});
	  } else if (file) {
	    const reader = new FileReader();

	    reader.onload = (e) => {
	      this.setState({
        	ready: true,
        	url: e.target.result
	      });
	    };
	    reader.readAsDataURL(file);
	  } else {
	    this.setState({
	      ready: true,
	      url: thumb
	    });
	  }
	}

	remove() {
	  const { image, isListingDefaults, publisher } = this.props;
	  if (isListingDefaults) {
	  	this.props.listingDefaultsActions.deleteListingDefaultImage(image);
	  } else {
	  	this.props.listingActions.deleteListingImage(publisher, image);
	  }
	}

	clearError() {
	  const { id } = this.props.image;
	  const { isListingDefaults } = this.props;
	  if (isListingDefaults) {
	  	this.props.listingDefaultsActions.clearListingDefaultImageError(id);
	  } else {
	  	this.props.listingActions.clearListingImageError(id);
	  }
	}

	renderError() {
	  const { uploadError, deleteError } = this.props.image;

	  if (!uploadError && !deleteError) {
	    return null;
	  }

	  const { formatMessage } = this.props.intl;
	  const msg = (
	    uploadError ?
	      formatMessage(messages.uploadImageError) :
	      formatMessage(messages.deleteImageError)
	  );

	  return (
  <div className="loading-overlay">
    <div className="content">
      <span className="error">{msg}</span>
      <Button
        type="submit"
        content={formatMessage(messages.close)}
        className="button--green-bg btn-close"
        onClick={this.clearError.bind(this)}
      />
    </div>
  </div>
	  );
	}

	render() {
	  const { uploading, deleting } = this.props.image;

	  return (
  <div className="img-container">
    {
        	this.state.url && !uploading &&
        	<Image
          src={RemoveIcon}
          width={iconSize}
          height={iconSize}
          className="remove-icon"
          onClick={this.remove.bind(this)}
        	/>
      	}
    {
        	this.state.url &&
        	<img alt="" src={this.state.url} width={132} height={100} className="added-img" />
        }
    {
	      	(uploading || deleting) &&
	      	<div className="loading-overlay">
  <Dimmer active inverted>
    <Loader size="small" />
  </Dimmer>
	      	</div>
        }
    { this.renderError() }
  </div>
	  );
	}
}

ImageItem.propTypes = {
  image: PropTypes.shape({
    file: PropTypes.object,
    uploading: PropTypes.bool,
    deleting: PropTypes.bool
  }).isRequired,
  imageId: PropTypes.string.isRequired,
  listingActions: PropTypes.shape({
    deleteListingImage: PropTypes.func,
    clearListingImageError: PropTypes.func
  }).isRequired,
  listingDefaultsActions: PropTypes.shape({
    deleteListingDefaultImage: PropTypes.func,
    clearListingDefaultImageError: PropTypes.func
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func
  }).isRequired,
  isListingDefaults: PropTypes.bool
};

ImageItem.defaultProps = {
  isListingDefaults: false
};

const mapDispatch = dispatch => ({
  listingActions: bindActionCreators({
    deleteListingImage,
    clearListingImageError
  }, dispatch),
  listingDefaultsActions: bindActionCreators({
  	deleteListingDefaultImage,
  	clearListingDefaultImageError
  }, dispatch)
});

export default connect(null, mapDispatch)(injectIntl(ImageItem));
