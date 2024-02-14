import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    card: {
        minWidth: 275,
        textAlign: 'center',
        height: '100%',
    },
});

const CardInfo = ({ title, nbInfo }) => {
    const classes = useStyles();

    return (
        <Card className={classes.card}>
            <CardContent>
                <Typography variant="h6" component="div">
                    {title}
                </Typography>
                <Typography variant="h4" component="div" style={{ marginTop: 10 }}>
                    {nbInfo}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default CardInfo;
