import React from "react";
import ClipboardButton from "react-clipboard.js";
import { Icon } from 'semantic-ui-react';

const CopyButton = ({
    className = "button",
    text = "",
    dataPlace = "right",
    buttonIcon = "",
    buttonText = "",
    onCopy = () => {}
}) => {
    return (
        <ClipboardButton
            data-clipboard-text={text}
            className={className}
            data-place={dataPlace}
            onCopy={onCopy}
        >
            {!!buttonText && buttonText}
            {!!buttonIcon && <Icon name={buttonIcon}/>}
        </ClipboardButton>
    );
};

export default CopyButton;