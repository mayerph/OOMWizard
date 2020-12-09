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
import {EditorState, RichUtils} from "draft-js";
import IconButton from "@material-ui/core/IconButton";
import {connect} from "react-redux";

class TextControl extends React.Component {
    applyStyle(style) {
        console.log(this.props.editorStateId)
        let newInlineStyles = this.props.inlineStyles
        if (typeof newInlineStyles !== 'undefined') {
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
        return (
            <Card className="text-control-card">
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
                    <IconButton>
                        <ColorizeIcon/>
                    </IconButton>
                    <IconButton>
                        <ColorizeIcon/>
                    </IconButton>
                    <IconButton>
                        <ColorizeIcon/>
                    </IconButton>
                    <IconButton>
                        <ColorizeIcon/>
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

