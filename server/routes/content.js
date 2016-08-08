module.exports = (app, models) => {
	app.get('/',(req,res) => {
		models.Client.findOne({'_id':'57a4c26204f4c9330888fb0e'},(err,client) => {
			console.log(client);
			if (err) {
                console.log(err);
                return;
            }
            models.Insert.findOne({client:client.id},(err,content) =>{
            	if (err){ return console.log(err)}
            		console.log('insert',content)

            	res.render('standard',{
            	client:client,
            	content:content
            	})
            })
            
		})
	})
}