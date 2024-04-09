export interface User {
    id: number
    email: string,
    password: string,
    fio: string,
    roles: [{
        name: string
    }]
}
