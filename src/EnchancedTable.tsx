import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { createStyles, lighten, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import { Data, EnhancedTableToolbarProps } from './CustomTypes';
import { rows } from './Form';
import { saveOnLocal, getDataFromLocal } from './StorageManagement';
import "./EnchancedTable.css";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (a: { [key in Key]: number | string | boolean }, b: { [key in Key]: number | string | boolean }) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
}

const headCells: HeadCell[] = [
    { id: 'name', numeric: false, disablePadding: true, label: 'Task Name' },
    { id: 'priority', numeric: true, disablePadding: false, label: 'Priority' },
    { id: 'done', numeric: true, disablePadding: false, label: 'Done' },
];

interface EnhancedTableProps {
    classes: ReturnType<typeof useStyles>;
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { classes, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'center' : 'left'}
                        padding='default'
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(1),
        },
        highlight:
            theme.palette.type === 'light'
                ? {
                    color: theme.palette.secondary.main,
                    backgroundColor: lighten(theme.palette.secondary.light, 0.85),
                }
                : {
                    color: theme.palette.text.primary,
                    backgroundColor: theme.palette.secondary.dark,
                },
        title: {
            flex: '1 1 100%',
        },
    }),
);

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
    const classes = useToolbarStyles();
    const { numSelected } = props;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                    <Typography className={classes.title} variant="h5" id="tableTitle" component="div">
                        Epic Todo List
                    </Typography>
                )}
        </Toolbar>
    );
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '80%',
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        paper: {
            width: '100%',
            marginBottom: theme.spacing(2),
        },
        table: {
            minWidth: 500,
        },
        visuallyHidden: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1,
        },
    }),
);


export default function EnhancedTable() {
    const classes = useStyles();
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof Data>('priority');
    const [selected, setSelected] = useState<string[]>([]);

    const [update, setUpdate] = useState<boolean>(false);
    const [dataRows, setData] = useState<Data[]>([]); //rows
    const [page, setPage] = useState<number>(0);
    const [dense, setDense] = useState<boolean>(false);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [showDelete, setShowDelete] = useState<string>('');

    useEffect(() => {
        let todos = getDataFromLocal();
        console.log('todos', todos, todos.length, typeof (todos));
        setData(todos);
    }, [])

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    const getIndex = (value: string, data: Data[]): number => {
        let index: number = -1;
        data.map((row, idx) => {
            if (row.id === value) {
                index = idx;
            };
        });
        return index;
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const selectedIndex = getIndex(id, dataRows);

        if (selectedIndex === 0) {
            dataRows[selectedIndex] = { ...dataRows[selectedIndex], [event.target.name]: event.target.checked }
            setData(dataRows)
        } else if (selectedIndex === selected.length - 1) {
            dataRows[selectedIndex] = { ...dataRows[selectedIndex], [event.target.name]: event.target.checked }
        } else if (selectedIndex > 0) {
            dataRows[selectedIndex] = { ...dataRows[selectedIndex], [event.target.name]: event.target.checked }
        }

        setUpdate(!update);
    };

    const removeRow = (id: string) => {
        const selectedIndex = getIndex(id, dataRows);
        let newDataRows: Data[] = [];

        if (selectedIndex === -1) {
            newDataRows = newDataRows.concat(dataRows, dataRows[selectedIndex]);
        } else if (selectedIndex === 0) {
            newDataRows = newDataRows.concat(dataRows.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newDataRows = newDataRows.concat(dataRows.slice(0, -1));
        } else if (selectedIndex > 0) {
            newDataRows = newDataRows.concat(
                dataRows.slice(0, selectedIndex),
                dataRows.slice(selectedIndex + 1),
            );
        }

        saveOnLocal(newDataRows);
        setData(newDataRows);
    }

    const onMouseEnter = (id: string): void => setShowDelete(id);
    const onMouseLeave = (): void => setShowDelete('');

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>

                <EnhancedTableToolbar numSelected={selected.length} />
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={dataRows.length}
                        />
                        <TableBody>
                            {stableSort(dataRows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {

                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onMouseEnter={() => onMouseEnter(row.id)}
                                            onMouseLeave={() => onMouseLeave()}
                                            tabIndex={-1}
                                            key={row.id}
                                        >
                                            <TableCell component="th" id={labelId} scope="row">
                                                {row.name}
                                            </TableCell>
                                            <TableCell align="center">{row.priority}</TableCell>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    name='done'
                                                    onChange={(event) => handleChange(event, row.id)}
                                                    checked={row.done}
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            </TableCell>
                                            <TableCell
                                                padding='none'
                                                size='small'>
                                                <span
                                                    className={showDelete === row.id ? 'buttonVisible' : 'buttonHidden'}
                                                    onClick={() => removeRow(row.id)}
                                                >
                                                    <Tooltip title="Delete">
                                                        <IconButton className={'deleteButon'} aria-label="Delete">
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 15]}
                    component="div"
                    count={dataRows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Dense padding"
            />
        </div >
    );
}
