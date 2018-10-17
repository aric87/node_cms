module.exports = function publicInit(app) {
	app.get('/', (req, res) => {
		return res.render(`${req.client.clientCode}/default`, {
			client: req.client,
			pageContent: 'Lorem	ipsum',
		});
	});
	app.get('/:slug', (req, res) => {

	})
}
