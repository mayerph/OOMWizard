import React from 'react';
import PropTypes from 'prop-types';
import './TextControl.css';
import Card from "@material-ui/core/Card";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import FormatBoldIcon from "@material-ui/icons/FormatBold";
import FormatItalicIcon from "@material-ui/icons/FormatItalic";
import FormatUnderlineIcon from "@material-ui/icons/FormatUnderlined";
import ColorizeIcon from "@material-ui/icons/Colorize";
import IconButton from "@material-ui/core/IconButton";
import {connect} from "react-redux";
import ResizableText from "../ResizableText/ResizableText";

class TextControl extends React.Component {
    applyStyle(style) {
        let newInlineStyles = this.props.inlineStyles
        if (typeof newInlineStyles !== 'undefined') {

            // remove all colors to ensure that there is only one color at anytime
            newInlineStyles = newInlineStyles.filter((s) => !Object.keys(ResizableText.colorStyleMap).includes(s))

            if (newInlineStyles.size === newInlineStyles.delete(style).size) {
                newInlineStyles = newInlineStyles.add(style)
            } else {
                newInlineStyles = newInlineStyles.delete(style)
            }
            this.props.dispatch({
                type: 'FOCUS_EDITOR_STATE',
                editorStateId: this.props.editorStateId,
                editorState: this.props.editorState,
                inlineStyles: newInlineStyles
            })
        }
    }

    render() {
        let controlVisibility = this.props.editorState ? 'visible' : 'hidden'
        return (
            <Card style={{visibility: controlVisibility}} className="text-control-card">
                <div>
                    <IconButton>
                        <AddIcon/>
                    </IconButton>
                    <IconButton>
                        <RemoveIcon/>
                    </IconButton>
                    <IconButton onClick={() => this.applyStyle('BOLD')}>
                        <FormatBoldIcon/>
                    </IconButton>
                    <IconButton onClick={() => this.applyStyle('ITALIC')}>
                        <FormatItalicIcon/>
                    </IconButton>
                    <IconButton onClick={() => this.applyStyle('UNDERLINE')}>
                        <FormatUnderlineIcon/>
                    </IconButton>
                    <IconButton onClick={() => this.applyStyle('black')}>
                        <ColorizeIcon style={{color: ResizableText.colorStyleMap.black.color}}/>
                    </IconButton>
                    <IconButton onClick={() => this.applyStyle('red')}>
                        <ColorizeIcon style={{color: ResizableText.colorStyleMap.red.color}}/>
                    </IconButton>
                    <IconButton onClick={() => this.applyStyle('green')}>
                        <ColorizeIcon style={{color: ResizableText.colorStyleMap.green.color}}/>
                    </IconButton>
                    <IconButton onClick={() => this.applyStyle('blue')}>
                        <ColorizeIcon style={{color: ResizableText.colorStyleMap.blue.color}}/>
                    </IconButton>
                </div>
            </Card>
        )
    }
}

TextControl.propTypes = {};

TextControl.defaultProps = {};

function mapStateToProps(state) {
    return {
        editorStateId: state.focusEditorState.editorStateId,
        editorState: state.focusEditorState.editorState,
        inlineStyles: state.focusEditorState.inlineStyles
    }
}


export default connect(mapStateToProps)(TextControl);

