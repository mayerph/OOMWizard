import React from 'react';
import PropTypes from 'prop-types';
import './NavBar.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';


class NavBar extends React.Component {

    render() {
        return (
            <div className="navbar-container">
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <MenuIcon/>
                        </IconButton>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<AddIcon/>}
                        >
                            Image
                        </Button>
                        <Typography variant="h6" className="navbar-container-title">
                            MemeWizard
                        </Typography>
                        <div>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                color="inherit"
                            >
                                <AccountCircle/>
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

NavBar.propTypes = {}

NavBar.defaultProps = {};

export default NavBar;
