import React from "react";
import {connect} from "alt-react";
import classNames from "classnames";
import Translate from "react-translate-component";
import counterpart from "counterpart";

class Categories extends React.Component {

    constructor() {
        super();
        this.state = {
            searchTerm: ""
        };
        this.categories = counterpart.translate("marketplace.categories");
    }

    _onSearch(type, e) {
        this.setState({[type]: e.target.value.toUpperCase()});
        SettingsActions.changeViewSetting({
            [type]: e.target.value.toUpperCase()
        });
    }

    render() {
        let placeholder = counterpart.translate("marketplace.search").toUpperCase();
        return (
            <div className="grid-block page-layout vertical">
                <div className="grid-container" style={{padding: "25px 10px 0 10px"}}>
                    <div className="block-content-header">
                        <input style={{maxWidth: "500px"}} placeholder={placeholder} type="text" value={this.state.searchTerm} onChange={this._onSearch.bind(this, "searchTerm")}></input>
                    </div>
                    <ul className="categories">
                        {this.categories.map((item) => {
                            let category = <li className="category"> {item.name} </li>;
                            let subcategories = item.subcategories.map((subcategory) => {
                                return (
                                    <li className="subcategory">
                                        <a>{subcategory}</a>
                                    </li>
                                );
                            });
                            return [category, ...subcategories];
                        })
                        }
                    </ul>
                </div>
            </div>
        );
    }
}

export default Categories;