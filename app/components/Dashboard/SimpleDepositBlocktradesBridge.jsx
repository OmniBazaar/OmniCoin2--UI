import React from "react";
import ZfApi from "react-foundation-apps/src/utils/foundation-api";
import BaseModal from "../Modal/BaseModal";
import Translate from "react-translate-component";
import { Asset } from "common/MarketClasses";
import utils from "common/utils";
import BindToChainState from "../Utility/BindToChainState";
import ChainTypes from "../Utility/ChainTypes";
import ReactTooltip from "react-tooltip";
import counterpart from "counterpart";
import {requestDepositAddress, validateAddress, WithdrawAddresses, getDepositLimit, estimateOutput, estimateInput} from "common/blockTradesMethods";
import BlockTradesDepositAddressCache from "common/BlockTradesDepositAddressCache";
import CopyButton from "../Utility/CopyButton";
import Icon from "../Icon/Icon";
import LoadingIndicator from "../LoadingIndicator";
import {blockTradesAPIs} from "api/apiConfig";
import FloatingDropdown from "../Utility/FloatingDropdown";
import {connect} from "alt-react";
import SettingsStore from "stores/SettingsStore";
import SettingsActions from "actions/SettingsActions";
import QRCode from "qrcode.react";

// import DepositFiatOpenLedger from "components/DepositWithdraw/openledger/DepositFiatOpenLedger";
// import WithdrawFiatOpenLedger from "components/DepositWithdraw/openledger/WithdrawFiatOpenLedger";

class SimpleDepositBlocktradesBridge extends React.Component {

    static propTypes = {
        sender: ChainTypes.ChainAccount.isRequired,
        asset: ChainTypes.ChainAsset.isRequired
    };

    constructor(props) {
        super();
        this.state = {
            toAddress: WithdrawAddresses.getLast(props.walletType),
            withdrawValue:"",
            amountError: null,
            inputAmount: 1,
            receiveLoading: true,
            limitLoading: true,
            apiError: false
        };

        this._validateAddress(this.state.toAddress, props);

        this.deposit_address_cache = new BlockTradesDepositAddressCache();
    }

    onClose() {
        ZfApi.publish(this.props.modalId, "close");
    }

    componentWillMount() {
        this._getDepositAddress();
    }

    componentDidMount() {
        this._getDepositLimit();
        this._estimateOutput();
    }

    componentWillReceiveProps(np) {
        if (np.inputCoinType !== this.props.inputCoinType || np.outputCoinType !== this.props.outputCoinType) {
            this._getDepositLimit(np);
            this._estimateOutput(np);
            this._getDepositAddress(np);
        }
    }

    shouldComponentUpdate(np, ns) {
        return (
            np.inputCoinType !== this.props.inputCoinType ||
            np.outputCoinType !== this.props.outputCoinType ||
            np.sender !== this.props.sender ||
            np.asset !== this.props.asset ||
            np.isAvailable !== this.props.isAvailable ||
            np.isDown !== this.props.isDown ||
            !utils.are_equal_shallow(ns, this.state)
        );
    }

    _getDepositLimit(props = this.props) {
        this.setState({limitLoading: true});
        getDepositLimit(props.inputCoinType, props.outputCoinType).then(res => {
            this.setState({
                depositLimit: res.depositLimit,
                limitLoading: false
            });
        }).catch(err => {
            console.log("deposit limit error:", err);
            this.setState({
                depositLimit: null,
                limitLoading: false
            });
        });
    }

    _estimateOutput(props = this.props) {
        this.setState({receiveAmount: 0, sendAmount: this.state.inputAmount});
        this.setState({receiveLoading: true});
        estimateOutput(this.state.inputAmount, props.inputCoinType, props.outputCoinType).then(res => {
            this.setState({
                inputAmount: parseFloat(res.inputAmount),
                receiveAmount: parseFloat(res.outputAmount),
                receiveLoading: false
            });
        }).catch(err => {
            console.log("receive amount err:", err);
            this.setState({receiveLoading: false, apiError: true});
        });
    }

    _estimateInput(props = this.props) {
        this.setState({receiveAmount: this.state.outputAmount, sendAmount: 0});
        this.setState({receiveLoading: true});

        estimateInput(this.state.outputAmount, props.inputCoinType, props.outputCoinType).then(res => {
            this.setState({
                inputAmount: parseFloat(res.inputAmount).toFixed(8),
                sendAmount: parseFloat(res.inputAmount).toFixed(8),
                receiveLoading: false
            });
        }).catch(err => {
            console.log("send amount err:", err);
            this.setState({receiveLoading: false, apiError: true});
        });
    }

    _getDepositAddress(props = this.props) {
        if (!props.inputCoinType) return;
        let receive_address;

        /* Always generate new address/memo for increased security */
        /*let account_name = props.sender.get("name");
        let receive_address = this.deposit_address_cache.getCachedInputAddress(
            "blocktrades",
            account_name,
            props.inputCoinType.toLowerCase(),
            props.outputCoinType.toLowerCase()
        );*/
        if (!receive_address) {
            this.setState({receive_address: null});
            requestDepositAddress(this._getDepositObject(props));
        } else {
            this.setState({
                receive_address
            });
        }
    }

    _getDepositObject(props = this.props) {
        return {
            inputCoinType: props.inputCoinType.toLowerCase(),
            outputCoinType: props.outputCoinType.toLowerCase(),
            outputAddress: props.sender.get("name"),
            url: blockTradesAPIs.BASE,
            stateCallback: (receive_address) => {
                this.addDepositAddress(
                    props.inputCoinType.toLowerCase(),
                    props.outputCoinType.toLowerCase(),
                    props.sender.get("name"),
                    receive_address
                );
            }
        };
    }

    addDepositAddress( input_coin_type, output_coin_type, account, receive_address ) {
        this.deposit_address_cache.cacheInputAddress(
            "blocktrades",
            account,
            input_coin_type,
            output_coin_type,
            receive_address.address,
            receive_address.memo
        );
        this.setState({
            receive_address
        });
    }

    componentDidUpdate() {
        ReactTooltip.rebuild();
    }

    _validateAddress(address, props = this.props) {
        validateAddress({walletType: props.walletType, newAddress: address})
            .then(isValid => {
                if (this.state.toAddress === address) {
                    this.setState({
                        withdraw_address_check_in_progress: false,
                        validAddress: isValid
                    });
                }
            }).catch(err => {
                console.error("Error when validating address:", err);
            });
    }

    _openRegistrarSite(e) {
        e.preventDefault();
        let newWnd = window.open(SettingsStore.site_registr, "_blank");
        newWnd.opener = null;
    }

    _onAmountChange(value, e) {
        switch(value) {
            case "input":
                this.setState({inputAmount: parseFloat(e.target.value)}, this._estimateOutput.bind(this));
                break;

            case "output":
                this.setState({outputAmount: parseFloat(e.target.value)}, this._estimateInput.bind(this));
                break;
        }
    }

    _onDropDownSelect(e) {
        SettingsActions.changeViewSetting({preferredBridge: e});
    }

    _renderDeposit() {
        const {name: assetName, prefix} = utils.replaceName(this.props.asset.get("symbol"), !!this.props.asset.get("bitasset"));
        const {receive_address, apiError} = this.state;
        const hasMemo = receive_address && "memo" in receive_address && receive_address.memo;
        const addressValue = receive_address && receive_address.address || "";
        const QR = <div className="SimpleTrade__QR"><QRCode size={140} value={addressValue}/></div>;

        let bridgeAssets = Object.keys(this.props.bridges.toJS());

        const inputName = this.props.inputCoinType.toUpperCase();
        const receiveName = (prefix ? prefix : "") + assetName;

        let price = receiveName === "BTS" && inputName === "BTC" ? (this.state.inputAmount / this.state.receiveAmount).toFixed(8) :
            (this.state.receiveAmount / this.state.inputAmount).toFixed(4);
        let priceSuffix = receiveName === "BTS" && inputName === "BTC" ? inputName +"/" + receiveName :
            receiveName +"/" + inputName;

        const aboveLimit = this.state.inputAmount > parseFloat(this.state.depositLimit);
        const aboveLimitStyle = aboveLimit ? {border: "1px solid #a94442"} : null;

        return (
            <div className={!addressValue ? "no-overflow" : ""}>
                <div className="SimpleTrade__withdraw-row">
                    <label className="left-label">ASSET</label>
                    <div className="inline-label input-wrapper">
                        <input disabled type="text" defaultValue={receiveName} />
                    </div>
                </div>
                <div className="SimpleTrade__withdraw-row">
                    <div className="grid-block">
                        <label className="left-label">BRIDGE</label>
                        <span data-tip={counterpart.translate("tooltip.bridge_TRADE")} className="inline-block tooltip">
                            &nbsp;<a href="https://www.blocktrades.us/contact"><Icon style={{position: "relative", top: 0}} name="question-circle" /></a>
                        </span>
                    </div>
                    <div className="inline-label input-wrapper">
                        <input disabled type="text" defaultValue={"BLOCKTRADES"} /> {/* Change this when we gain more brdiges */}
                    </div>
                </div>
                <span style={!apiError ? {display: ""} : {display: "none"}}>
                    <div className="SimpleTrade__withdraw-row">
                        <div className="no-margin no-padding">
                            <div className="small-6" style={{paddingRight: 10}}>
                                <div className="grid-block">
                                    <label className="left-label"><Translate content="transfer.send" />
                                        {aboveLimit ? 
                                            <div className="error-msg inline-block tooltip" data-tip={counterpart.translate("tooltip.over_limit")}>
                                                <Translate content="gateway.over_limit" />&nbsp;<Icon name="question-circle" />
                                            </div> : null}
                                    </label>
                                </div>
                                <div className="inline-label input-wrapper">
                                    <input style={aboveLimitStyle} type="number" defaultValue={1} value={this.state.sendAmount || 0} onInput={this._onAmountChange.bind(this, "input")}/>
                                    <div className="form-label select floating-dropdown">
                                        <FloatingDropdown
                                            entries={bridgeAssets}
                                            values={bridgeAssets.reduce((map, a) => {if (a) map[a] = a; return map;}, {})}
                                            singleEntry={bridgeAssets[0]}
                                            value={this.props.preferredBridge || bridgeAssets[0]}
                                            onChange={this._onDropDownSelect}
                                            upperCase
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="small-6" style={{paddingLeft: 10}}>
                                <label className="left-label"><Translate content="gateway.deposit_limit" /></label>
                                <div className="inline-label input-wrapper">
                                    <input disabled type="number" value={this.state.depositLimit && parseFloat(this.state.depositLimit).toFixed(4) || 0}/>
                                    <div className="input-right-symbol">{inputName}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="SimpleTrade__withdraw-row">
                        <div className="no-margin no-padding">
                            <div className="small-6" style={{paddingRight: 10}}>
                                <label className="left-label"><Translate content="exchange.receive" /></label>
                                <div className="inline-label input-wrapper">
                                    <input style={aboveLimitStyle} type="number" value={this.state.receiveAmount || 0} onInput={this._onAmountChange.bind(this, "output")} />
                                    <div className="input-right-symbol">{receiveName}</div>
                                </div>
                            </div>
                            <div className="small-6" style={{paddingLeft: 10}}>
                                <div className="grid-block">
                                    <label className="left-label"><Translate content="exchange.price" />
                                    &nbsp;&nbsp;{this.state.receiveLoading ? <Translate content="footer.loading" /> : ""}</label>
                                </div>
                                <div className="inline-label input-wrapper">
                                    <input disabled type="number" value={aboveLimit ? 0 : price} />
                                    <div className="input-right-symbol">{receiveName}/{inputName}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {!addressValue ? <div style={{textAlign: "center"}}><LoadingIndicator type="three-bounce"/></div> :
                        <div className="SimpleTrade__withdraw-row" style={{textAlign: "center"}}>
                            {hasMemo ? null : QR}
                            <div className="grid-block SimpleTrade__deposit-info">
                                <div className="copyIcon">
                                    <CopyButton text={addressValue} className={"SimpleTrade__copyIcon"} />
                                </div>
                                <div className="deposit-details">
                                    <div><Translate component="div" unsafe content="gateway.purchase_notice" inputAsset={inputName} outputAsset={receiveName} /></div>
                                    <div>{addressValue}</div>
                                </div>
                            </div>
                            {hasMemo ?
                                <div className="grid-block SimpleTrade__deposit-info" style={{marginTop: "10px"}}>
                                    <div className="copyIcon">
                                        <CopyButton text={receive_address.memo} className={"SimpleTrade__copyIcon"} />
                                    </div>
                                    <div className="deposit-details">
                                        <div><Translate component="div" unsafe content="gateway.purchase_notice_memo" /></div>
                                        <div>{receive_address.memo}</div>
                                    </div>
                                </div> : null}
                        </div>}
                    <div className="SimpleTrade__withdraw-row" style={{textAlign: "center", paddingBottom: "2rem"}}>
                        <div className="no-margin no-padding">
                            <button className="ActionButton_Close" onClick={this.onClose.bind(this)}>
                                <Translate content="transfer.close" />
                            </button>
                        </div>
                    </div>
                </span>
                <span style={apiError ? {display: ""} : {display: "none"}}>
                    <div className="SimpleTrade__withdraw-row" style={{textAlign: "center", paddingBottom: "2rem", color: "#bb2926"}}>
                        <Translate className="txtlabel cancel" content="gateway.unavailable_TRADE" component="p" />
                        <button className="ActionButton_Close" onClick={this.onClose.bind(this)}>
                            <Translate content="transfer.close" />
                        </button>
                    </div>
                </span>
            </div>
        );
    }

    _renderCurrentBalance() {
        const {name: assetName} = utils.replaceName(this.props.asset.get("symbol"), !!this.props.asset.get("bitasset"));
        const isDeposit = this.props.action === "deposit";

        let currentBalance = this.props.balances.find(b => {
            return b && b.get("asset_type") === this.props.asset.get("id");
        });

        let asset = currentBalance ? new Asset({
            asset_id: currentBalance.get("asset_type"),
            precision: this.props.asset.get("precision"),
            amount: currentBalance.get("balance")
        }) : null;

        const applyBalanceButton = isDeposit ?
            <span style={{border: "2px solid black", borderLeft: "none"}} className="form-label">{assetName}</span> :
        (
            <button
                data-place="right" data-tip={counterpart.translate("tooltip.withdraw_full")}
                className="button"
                style={{border: "2px solid black", borderLeft: "none"}}
                onClick={this._updateAmount.bind(this, !currentBalance ? 0 : parseInt(currentBalance.get("balance"), 10))}
            >
                <Icon name="clippy" />
            </button>
        );

        return (
            <div className="SimpleTrade__withdraw-row" style={{fontSize: "1rem"}}>
                <label style={{fontSize: "1rem"}}>
                    {counterpart.translate("gateway.balance_asset", {asset: assetName})}:
                    <span className="inline-label">
                        <input
                            disabled
                            style={{color: "black", border: "2px solid black", padding: 10, width: "100%"}}
                            value={!asset ? 0 : asset.getAmount({real: true})}
                        />
                        {applyBalanceButton}
                    </span>
                </label>
            </div>
        );
    }

    render() {
        let {asset} = this.props;

        if (!asset) {
            return null;
        }
        
        let logo = require("assets/omni-logo.png");

        return (
            <div className="SimpleTrade__modal">
                <div className="Modal__header" style={{background: "none", padding: "1rem"}}></div>
                
                <div
                    className="grid-block vertical no-overflow"
                    style={{
                        zIndex: 1002,
                        paddingLeft: "2rem",
                        paddingRight: "2rem",
                    }}>

                    <div style={{textAlign: "center"}}>
                        <img style={{margin: 0, height: 60}} src={logo} /><br />
                        <p style={{fontSize: "1.6rem", fontWeight: "bold", marginBottom: 0}}>Buy</p>
                    </div>

                    {this.props.isDown ?
                        <div style={{textAlign: "center"}}><Translate className="txtlabel cancel" content="gateway.unavailable_TRADE" component="p" /></div> :
                        !this.props.isAvailable ? <div style={{textAlign: "center"}}><Translate className="txtlabel cancel" content="gateway.unavailable" component="p" /></div> :
                        this._renderDeposit()}
                </div>
            </div>
        );
    }
}
SimpleDepositBlocktradesBridge = BindToChainState(SimpleDepositBlocktradesBridge);

class StoreWrapper extends React.Component {
    render() {
        let {preferredBridge, ...others} = this.props;
        let currentBridge = this.props.bridges.get(this.props.preferredBridge);
        if (!currentBridge) {
            currentBridge = this.props.bridges.first();
            preferredBridge = currentBridge.inputCoinType;
        }
        return <SimpleDepositBlocktradesBridge {...others} preferredBridge={preferredBridge} {...currentBridge.toJS()} />;
    }
}

StoreWrapper = connect(StoreWrapper, {
    listenTo() {
        return [SettingsStore];
    },
    getProps() {
        return {
            preferredBridge: SettingsStore.getState().viewSettings.get("preferredBridge", "btc")
        };
    }
});

export default class SimpleDepositBlocktradesBridgeModal extends React.Component {
    constructor() {
        super();

        this.state = {
            open: false
        };
    }

    show() {
        this.setState({open: true}, () => {
            ZfApi.publish(this.props.modalId, "open");
        });
    }

    onClose() {
        this.setState({open: false});
    }

    render() {
        if (!this.props.bridges) return null;

        return (
            <BaseModal className="test" onClose={this.onClose.bind(this)} id={this.props.modalId} overlay={true}>
                {this.state.open ? <StoreWrapper {...this.props} open={this.state.open} /> : null}
            </BaseModal>
        );
    }
}
