export interface Data {
    id: string,
    name: string,
    priority: string,
    done: boolean,
};

export interface IPriority {
    high: string,
    medium: string,
    low: string
};

export interface EnhancedTableToolbarProps {
    numSelected: number;
}