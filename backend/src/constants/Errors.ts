export enum DatabaseError
{
    UserNotFoundError = "User not found",
    PageNotFoundError = "Page not found",
    PagePersistError = "Could not persist page"
}

export enum Error
{
    RuntimeError = "Runtime error"
}

export enum ValidationError
{
    Generic = "Validation failed",
    BadPasswordError = "Password validation error",
    BadUserNameError = "User name validation error",
    BadUserGuidError = "User guid validation error",
    BadUpdateParamsError = "All update params were null or undefined"
}
