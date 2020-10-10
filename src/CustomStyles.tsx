import { createMuiTheme } from '@material-ui/core/styles';
import { orange } from '@material-ui/core/colors';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
    palette: {
        primary: {
            main: orange[500],
        },
    },
});

export const useCheckboxStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            color: '#A9A9A9',
            '&$checked': {
                color: orange[500],
            },
        },
        checked: {},
    }),
);