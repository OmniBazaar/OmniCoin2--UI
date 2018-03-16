import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadEscrowTransactions, loadEscrowAgents } from '../../../../services/escrow/escrowActions';
import './escrow.scss';

class Escrow extends Component {


  constructor(props) {
    super(props);
  }

  componentDidMount(){
    this.props.escrowActions.loadEscrowTransactions();
    this.props.escrowActions.loadEscrowAgents();
  }

  render() {
    console.log(this.props.escrow.transactions);
    console.log(this.props.escrow.agents);
    return (
      <div>
                
      </div>
    );
  }
}

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    escrowActions: bindActionCreators({
      loadEscrowTransactions,
      loadEscrowAgents
    }, dispatch),
  }),
)(Escrow);

