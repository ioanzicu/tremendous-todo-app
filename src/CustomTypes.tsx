import { Theme } from "@material-ui/core";

export interface Data {
    id: string,
    name: string,
    priority: number,
    done: boolean,
};

export interface IPriority {
    High: number,
    Medium: number,
    Low: number
};

export interface EnhancedTableToolbarProps {
    numSelected: number;
}

export interface IForm {
    showForm: Boolean,
    setShowForm: React.Dispatch<React.SetStateAction<Boolean>>,
    theme: Theme,
}