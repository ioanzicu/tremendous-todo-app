import React, { useState } from 'react';
import { ThemeProvider, createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import WarningIcon from '@material-ui/icons/Warning';
import LowPriorityIcon from '@material-ui/icons/LowPriority';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import { saveOnLocal, getDataFromLocal } from './StorageManagement';
import { uniqueId, getKeyByValue } from './Utils';
import { Data, IPriority, IForm } from './CustomTypes';

function createData(
    name: string,
    priority: number,
    done: boolean,
): Data {
    return { id: uniqueId(), name, priority, done };
}

const priority: IPriority = {
    'High': 2,
    'Medium': 1,
    'Low': 0,
}

export const rows: Data[] = getDataFromLocal();

const useStyles: (props?: any) => Record<"root", string> = makeStyles((theme: Theme) =>
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

export default function Form({ showForm, setShowForm, theme }: IForm) {
    const classes = useStyles();

    const [name, setName] = useState<string>('');
    const [taskPriority, setPriority] = useState<number>(1); //'Medium'
    const [checked, setChecked] = useState<boolean>(false);
    const [validData, setValidData] = useState<boolean>(false);

    const priorityValues: {
        value: number;
        label: any;
    }[] = [
            {
                value: priority.High,
                label: PriorityHighIcon,
            },
            {
                value: priority.Medium,
                label: WarningIcon
            },
            {
                value: priority.Low,
                label: LowPriorityIcon,
            },
        ];

    const handleTaskName = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setName(event.target.value);
    }

    const handlePriorityChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setPriority(parseInt(event.target.value));
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

        // Save on local
        saveOnLocal(rows);

        // Redirect to the Tasks table
        setShowForm(!showForm);

        // Clean the form
        setName('');
        setPriority(1); //'Medium'
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
                            <option.label /> - {getKeyByValue(priority, option.value)}
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
                    <ThemeProvider theme={theme}>

                        <Button variant="contained" type="submit" color="primary">
                            Submit
                    </Button>
                    </ThemeProvider>

                </div>
            </form>
        </div>
    );
}