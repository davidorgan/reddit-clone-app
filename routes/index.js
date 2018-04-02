// Full Documentation - https://www.turbo360.co/docs
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const router = vertex.router()
const CDN = (process.env.TURBO_ENV == 'dev') ? '' : process.env.TURBO_CDN

router.get('/', (req, res) => {
	const recentTopics = [
		{room: 'Politics',title: "Will I win???", profile: {username: 'dtrump', image: ''}, numReplies: "4", date: "March 20, 2018"},
		{room: 'Sports',title: "How about that game!!", profile: {username: 'lebron', image: ''}, numReplies: "38", date: "March 23, 2018"}
	]

	const config = {
		cdn: CDN,
		page: "Home",
		topics: recentTopics,
		loggedIn: 'false'
	}

	    //No one logged in
		if (req.vertexSession == null) {
			res.render('index', config)
		}
	 
		//No one logged in
		if (req.vertexSession.user == null) {
			res.render('index', config)
		}
	 
		//Someone logged in
		turbo.fetchOne('user', req.vertexSession.user.id)
		.then(data => {
			delete config['loggedIn']
			config['user'] = data
			return turbo.fetch('room', {subscribers: data.id});
			
		})
		.then(rooms => {
			console.log('ROOMS :'+ JSON.stringify(rooms))
			config['rooms'] = rooms
			res.render('index', config)
		})
		.catch(err => {
			res.render('index', config)
		})
	 
})
router.get('/addRoom', (req, res) => {
	const config = {
		cdn: CDN
	}
	//No one logged in
	if (req.vertexSession == null) {
		res.redirect('/')
	}
	
	//No one logged in
	if (req.vertexSession.user == null) {
		res.redirect('/')
	}

	//Someone logged in
	turbo.fetchOne('user', req.vertexSession.user.id)
	.then(data => {
		config['user'] = data
		res.render('addRoom', config)
	})
	.catch(err => {
		res.render('addRoom', config)
	})
	
})

router.get('/rooms', (req, res) => {
	res.render('rooms', null)
})

router.get('/room/:id', (req, res) => {
	res.render('room', {room: req.params.id})
})

module.exports = router
