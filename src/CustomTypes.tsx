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