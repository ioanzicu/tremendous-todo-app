import React, { useEffect, useState } from 'react';
import { withStyles, makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';

import { Data } from './CustomTypes';
import { rows } from './Form';
import { saveOnLocal, getDataFromLocal } from './StorageManagement';
import { IPriority, IHeadCell } from './CustomTypes';
import { getKeyByValue } from './Utils';
import { useCheckboxStyles } from './CustomStyles';
import './styles/EnchancedTable.css';

const priority: IPriority = {
    'High': 2,
    'Medium': 1,
    'Low': 0,
}

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

const headCells: IHeadCell[] = [
    { id: 'name', numeric: false, disablePadding: true, label: 'Task Name' },
    { id: 'priority', numeric: true, disablePadding: false, label: 'Priority' },
    { id: 'done', numeric: true, disablePadding: false, label: 'Done' },
];

interface IEnhancedTableProps {
    classes: ReturnType<typeof useStyles>;
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

const StyledTableCell = withStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: '#595338',
            color: theme.palette.common.white,
            '&:hover': {
                color: theme.palette.common.white,
            },
        },
        head: {
            backgroundColor: '#595338',
            color: theme.palette.common.white,
        },
        body: {
            fontSize: 14,
        },
    }),
)(TableCell);


const StyledTableSortLabel = withStyles((theme: Theme) =>
    createStyles({
        root: {
            color: 'white',
            "&:hover": {
                color: 'white',
            },
            '&$active': {
                color: 'white',
            },
        },
        active: {},
        icon: {
            color: 'inherit !important'
        },
    })
)(TableSortLabel);

function EnhancedTableHead(props: IEnhancedTableProps) {
    const { classes, order, orderBy, onRequestSort } = props;
    const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <StyledTableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'center' : 'left'}
                        padding='default'
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <StyledTableSortLabel
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
                        </StyledTableSortLabel>
                    </StyledTableCell>
                ))}
                {/* Placeholder space */}
                <StyledTableCell>
                </StyledTableCell>
            </TableRow>
        </TableHead >
    );
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        paper: {
            width: '100%',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: theme.spacing(2),
        },
        table: {
            minWidth: 400,
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
        }
    }),
);

export default function EnhancedTable() {
    const classes = useStyles();
    const checkBoxClasses = useCheckboxStyles();
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof Data>('priority');
    const [selected] = useState<string[]>([]);

    const [update, setUpdate] = useState<boolean>(false);
    const [dataRows, setData] = useState<Data[]>([]); //rows
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [showDelete, setShowDelete] = useState<string>('');

    useEffect(() => {
        let todos = getDataFromLocal();
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

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    const getIndex = (value: string, data: Data[]): number => {
        let index: number = -1;
        data.forEach((row, idx) => {
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
            <h2>Epic Todo List</h2>
            <Paper className={classes.paper}>
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
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
                                            <TableCell align="center">{getKeyByValue(priority, row.priority)}</TableCell>
                                            <TableCell
                                                align="center"
                                                padding="checkbox"
                                            >
                                                <Checkbox
                                                    name='done'
                                                    classes={{
                                                        root: checkBoxClasses.root,
                                                        checked: checkBoxClasses.checked,
                                                    }}
                                                    onChange={(event) => handleChange(event, row.id)}
                                                    checked={row.done}
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            </TableCell>
                                            <TableCell
                                                padding="checkbox"
                                                size='small'
                                            >
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
                                <TableRow style={{ height: 53 * emptyRows }}>
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
        </div >
    );
}
