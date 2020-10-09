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

function uniqueId() {
    let u = Date.now().toString(16) + Math.random().toString(16) + '0'.repeat(16);
    let guid = [u.substr(0, 8), u.substr(8, 4), '4000-8' + u.substr(13, 3), u.substr(16, 12)].join('-');
    return guid;
}

function createData(
    name: string,
    priority: string,
    done: boolean,
): Data {
    return { id: uniqueId(), name, priority, done };
}

const priority: { high: string, medium: string, low: string } = {
    'high': 'High',
    'medium': 'Medium',
    'low': 'Low',
}

export const rows = [
    createData('Learn to play basse', priority.high, false),
    createData('Learn Polish language', priority.low, false),
    createData('Buy food', priority.medium, false),
    createData('Clean the room', priority.low, false),
    createData('Finish diploma thesis', priority.high, false),
    createData('Go to a pizza with firends', priority.medium, true),
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

interface IForm {
    showForm: Boolean,
    setShowForm: any,
}

export default function Form({ showForm, setShowForm }: IForm) {
    const classes = useStyles();

    const [name, setName] = useState<string>('');
    const [taskPriority, setPriority] = useState<string>('Medium');
    const [checked, setChecked] = useState<boolean>(false);
    const [validData, setValidData] = useState<boolean>(false);

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
        event.preventDefault();

        if (name === '') {
            setValidData(!validData);
            return;
        }

        let newTodo: Data = createData(name, taskPriority, checked);
        rows.push(newTodo);

        // Redirect to the Tasks table
        setShowForm(!showForm);

        // Clean the form
        setName('');
        setPriority('Medium');
        setChecked(false);
    };

    return (
        <div>

            <h1>Add a new Task</h1>

            <form className={classes.root} noValidate onSubmit={handleSubmit} autoComplete="off">
                <TextField
                    id="standard-basic"
                    error={validData}
                    onChange={handleTaskName}
                    value={name}
                    label="Task Name"
                    helperText="*Field cannot be empty"
                />
                <br />
                <TextField
                    id="standard-select-priority"
                    select
                    label="Priority"
                    value={taskPriority}
                    onChange={handlePriorityChange}
                    helperText="Please Select the Priority of the Task"
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