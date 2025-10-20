export default {
    routes:[
        {
            method: 'POST',
            path:'/content-creator/register' ,
            handler: 'content-creator.register',
            config: {
                auth:false,
            },
        }

    ]


}