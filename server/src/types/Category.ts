interface Category {
    name:string;
    channels:Array<{
        name:string;
        url:string;
        title:string;
        channelId:string
    }>
}

export default Category;
