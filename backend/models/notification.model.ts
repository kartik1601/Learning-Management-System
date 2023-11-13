import mongoose, {Document,Model,Schema} from "mongoose";

export interface INotfication extends Document{
    title: string;
    message: string;
    status: string;
    userId: string;
}

const notificationSchema = new Schema<INotfication>({
    title:{
        type:String,
        required:true,
    },
    message:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
        default:"unread",
    },
},{timestamps:true});

const NotficationModel: Model<INotfication> = mongoose.model("Notification",notificationSchema);

export default NotficationModel;