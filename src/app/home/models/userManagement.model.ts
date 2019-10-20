//model to store user object
export class User {
    employeeID: string;
    displayName: string;
    email: string;
    roles: Role[];
    departments: any;
    avaiableMenus: Menus;
    token: string;
}

//model to store role object
export class Role {
    role: string;
    roleDescription: string;
}

//model to store menu object
export class Menus {
    title: string;
    titleLoc: string
    icon: string;
    link: string
    sequenceNumber: number
    children: Menus
}
