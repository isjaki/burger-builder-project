import React from 'react';

import classes from './DrawerToggle.module.css';

const drawerToggle = (props) => (
    <div 
        onClick={props.clicked}
        className={classes.ToggleButton}>MENU</div>
);

export default drawerToggle;