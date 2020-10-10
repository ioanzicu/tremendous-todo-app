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

export interface IForm {
    showForm: Boolean,
    setShowForm: React.Dispatch<React.SetStateAction<Boolean>>,
}

export interface IHeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
}
