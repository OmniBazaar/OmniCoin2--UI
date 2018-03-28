import React, { Component } from 'react';

class CategoryListing extends Component {
  render() {
    const { type } = this.props.location;

    return (
      <div>Testing {type}</div>
    );
  }
}

export default CategoryListing;
