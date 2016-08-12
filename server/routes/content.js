module.exports = (app, models, services) => {
	app.get('/',(req,res) => {
		services.client.getClient(req.hostname).then(function(client){
            services.insert.getInsert(client,'index').then(function(content){
                res.render('standard',{
                    client,
                    content
                })
            }).catch(function(error){
                res.render('error',{
                    client,
                    error:error.toString()
                })
            })            
        }).catch(function(error){
            res.render('error',{
                error:error.toString()
            })
        })
         
	});
    app.get('/:slug',(req,res) => {
        services.client.getClient(req.hostname).then(function(client){
            services.insert.getInsert(client,req.params.slug).then(function(content){
                if(content){
                    res.render('standard',{
                        client,
                        content
                    })
                } else {
                    res.render('error',{
                        client,
                        error:'Sorry, page not found'
                    })
                }
            }).catch(function(error){
                res.render('error',{
                    client,
                    error:error.toString()
                })
            })            
        }).catch(function(error){
            res.render('error',{
                error:error.toString()
            })
        })
    })
}