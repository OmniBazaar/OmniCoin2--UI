import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, Button } from 'semantic-ui-react';
import RemoveIcon from '../../../../../../../../images/btn-remove-image-norm+press.svg';
import LoadingIcon from '../../../../../../../../images/loading.gif';

const imageSize = 42;
const iconSize = 23;
const loadingIconSize = 24;

class ImageItem extends Component {
	state = {
		ready: false,
		url: null
	}

	componentWillMount() {
		const { file, thumb } = this.props.image;
		if (file) {
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

	}

	render() {
		const { uploading } = this.props.image;

		return (
			<div className="img-container">
        {
        	this.state.url && !uploading &&
        	<Image src={RemoveIcon} 
	        	width={iconSize} 
	        	height={iconSize} 
	        	className="remove-icon" 
	        	onClick={this.remove.bind(this)} />
      	}
        {
        	this.state.url &&
        	<img alt="" src={this.state.url} width={132} height={100} className="added-img" />
        }
        {
        	uploading &&
        	<div className='loading-overlay'>
        		<Image src={LoadingIcon} 
		        	width={loadingIconSize} 
		        	height={loadingIconSize} 
		        	className="loading-icon" />
        	</div>
        }
      </div>
		);
	}
};

ImageItem.propTypes = {
	image: PropTypes.shape({
		file: PropTypes.object,
		uploading: PropTypes.bool
	}).isRequired,
	index: PropTypes.number.isRequired
};

export default ImageItem;