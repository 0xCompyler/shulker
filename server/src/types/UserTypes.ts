import Category from "./Category";

interface User {
    _id:string;
    name:string;
    profileImage:string;
    email:string;
    categories:Array<Category>;
}

export default User;