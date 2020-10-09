import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import WarningIcon from '@material-ui/icons/Warning';
import LowPriorityIcon from '@material-ui/icons/LowPriority';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import { Data } from './CustomTypes';

function createData(
    id: string,
    name: string,
    priority: string,
    done: boolean,
): Data {
    return { id, name, priority, done };
}

const priority: { high: string, medium: string, low: string } = {
    'high': 'High',
    'medium': 'Medium',
    'low': 'Low',
}

export const rows = [
    createData('1asdas', 'Learn to play basse', priority.high, false),
    createData('2adasda', 'Learn Polish language', priority.low, false),
    createData('3aasdad', 'Buy food', priority.medium, false),
    createData('4awda', 'Clean the room', priority.low, false),
    createData('5wwda', 'Finish diploma thesis', priority.high, false),
    createData('6are', 'Go to a pizza with firends', priority.medium, true),
];

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& > div': {
                margin: theme.spacing(1),
                width: '25ch',
                paddingBottom: '1rem',
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
    }),
);

export default function Form() {
    const classes = useStyles();

    const [name, setName] = useState<string>('');
    const [taskPriority, setPriority] = useState<string>('Medium');
    const [checked, setChecked] = useState<boolean>(false);

    const priorityValues: {
        value: string;
        label: any;
    }[] = [
            {
                value: priority.high,
                label: PriorityHighIcon,
            },
            {
                value: priority.medium,
                label: WarningIcon
            },
            {
                value: priority.low,
                label: LowPriorityIcon,
            },
        ];

    const handleTaskName = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setName(event.target.value);
    }

    const handlePriorityChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setPriority(event.target.value);
    };

    const handleDoneChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setChecked(event.target.checked);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        let todo = { name, taskPriority, done: checked };
        console.log(todo);
        event.preventDefault();

        setName('');
        setPriority('Medium');
        setChecked(false);
    };

    return (
        <div>

            <h1>Add a new Task</h1>

            <form className={classes.root} noValidate onSubmit={handleSubmit} autoComplete="off">
                <TextField id="standard-basic" onChange={handleTaskName} value={name} label="Task Name" />
                <br />
                <TextField
                    id="standard-select-priority"
                    select
                    label="Priority"
                    value={priority}
                    onChange={handlePriorityChange}
                    helperText="Please Priority of the Task"
                >
                    {priorityValues.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            <option.label /> - {option.value}
                        </MenuItem>
                    ))}
                </TextField>
                <br />
                <div>
                    Done:
                <Checkbox
                        checked={checked}
                        onChange={handleDoneChange}
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                </div>
                <div>
                    <br />
                    <Button variant="contained" type="submit" color="primary">
                        Submit
                    </Button>
                </div>
            </form>
        </div>
    );
}