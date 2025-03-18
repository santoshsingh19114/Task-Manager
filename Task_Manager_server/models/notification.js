

const notification=new Schema(
    {
        team:[{type:Schema.Types.ObjectId,ref:"User"}],
        text:{type:String},
        task:{type:Schema.Types.ObjectId,ref:"Task"},
        notiType:{Type:String,default:"alert",enum:["alert","message"]},
        isRead:[{type:Schema.Types.ObjectId,ref:"user"}],

    },
    {timeStamps:true}
);


const Notice=mongoose.model("Notice",noticeSchema);

export default Notice;